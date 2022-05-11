from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from os import scandir, path, sep

from chromium.models import *
from config.error import *

def get_diff(path):
    if path in Chromium.diff_cache.keys():
        return Chromium.diff_cache[path]

    ROOT = Chromium.chromium_repo
    os.chdir(ROOT)

    msgs = os.popen(f"git diff --shortstat {Chromium.current_version}..{Chromium.target_version} {path}").read().split(" ")

    try:
        insertion = int(msgs[msgs.index('insertions(+),') - 1])
    except ValueError:
        insertion = 0
    try:
        deletion = int(msgs[msgs.index('deletions(-)\n') - 1])
    except ValueError:
        deletion = 0
    
    Chromium.diff_cache[path] = {"insertion": insertion, "deletion": deletion}

    return {"insertion": insertion, "deletion": deletion}

# Create your views here.
class DiffViewSet(viewsets.GenericViewSet):
    # GET /diff/dir?path=<path>
    @action(detail=False, methods=['GET'], url_path='dir')
    def directory_list(self, request):
        if not Chromium.INITIALIZED:
            raise InitializeException()
        
        DEFAULT_PATH = ""
        ROOT = Chromium.chromium_repo

        p = request.query_params.get('path') if request.query_params.get('path') else DEFAULT_PATH
        dirpath = ROOT + p

        if not (path.isdir(dirpath) and (path.abspath(dirpath)+sep).startswith(path.abspath(ROOT)+sep)):
            raise InvalidPathException()

        parent = [] if path.samefile(ROOT, dirpath) else [
                    {"name": "..", "path": path.relpath(dirpath+"/..", ROOT), "insertion": 0, "deletion": 0}]

        directories = [{"name": f.name, "path": path.relpath(f.path, ROOT)} for f in scandir(dirpath) if f.is_dir()]
        files = [{"name": f.name, "path": path.relpath(f.path, ROOT)} for f in scandir(dirpath) if f.is_file()]
        
        directories = parent + [{**dir, **get_diff(dir["path"])} for dir in directories]
        files = [{**file, **get_diff(file["path"])} for file in files]

        tot_insert = 0
        tot_delete = 0
        for dir in directories:
            tot_insert += dir["insertion"]
            tot_delete += dir["deletion"]
        
        for f in files:
            tot_insert += f["insertion"]
            tot_delete += f["deletion"]

        data = {
            "total_insertion": tot_insert,
            "total_deletion": tot_delete,
            "current_version": Chromium.current_version,
            "target_version": Chromium.target_version,
            "directories": directories,
            "files": files,
        }
        
        return Response(data, status=status.HTTP_200_OK)