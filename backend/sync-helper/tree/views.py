from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from os import scandir, path, sep
from chromium.models import *
from config.error import *

# Create your views here.
class TreeViewSet(viewsets.GenericViewSet):
    # GET /tree/dir?path=<path>
    @action(detail=False, methods=['GET'], url_path='dir')
    def directroy_list(self, request):
        DEFAULT_PATH = ""
        p = request.query_params.get('path') if request.query_params.get('path') else DEFAULT_PATH
        dirpath = chromium_repo + p

        if not (path.isdir(dirpath) and (path.abspath(dirpath)+sep).startswith(path.abspath(chromium_repo)+sep)):
            raise InvalidPathException()

        # print(f"path={dirpath}")
        directories = [] if path.samefile(chromium_repo, dirpath) else [{"name": "..", "path": path.relpath(dirpath+"/..", chromium_repo)}]
        directories += [{"name": f.name, "path": path.relpath(f.path, chromium_repo)} for f in scandir(dirpath) if f.is_dir()]
        files = [{"name": f.name, "path": path.relpath(f.path, chromium_repo)} for f in scandir(dirpath) if f.is_file()]
        
        data = {
            "directories": directories,
            "files": files
        }
        
        return Response(data, status=status.HTTP_200_OK)
