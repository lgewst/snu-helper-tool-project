import re
from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from os import scandir, path, sep

from chromium.models import *
from config.error import *

# Create your views here.
class ChromiumViewSet(viewsets.GenericViewSet):
    # GET /chromium/init
    @action(detail=False, methods=['GET'], url_path='init')
    def initialize(self, request):
        if not Chromium.set_chromium_repo(request.query_params.get('chromium_repo')):
            raise InvalidChromiumRepoException()
        if not Chromium.set_webosose_repo(request.query_params.get('webosose_repo')):
            raise InvalidWebososeRepoException()
        if not Chromium.set_current_version(request.query_params.get('current_version')):
            raise InvalidVersionException()
        if not Chromium.set_target_version(request.query_params.get('target_version')):
            raise InvalidVersionException()

        Chromium.INITIALIZED = True
        return Response({'message': 'initialized!'}, status=status.HTTP_200_OK)
    
    # GET /chromium/dir?path=<path>
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

        # print(f"path={dirpath}")
        directories = [] if path.samefile(ROOT, dirpath) else [{"name": "..", "path": path.relpath(dirpath+"/..", ROOT)}]
        directories += [{"name": f.name, "path": path.relpath(f.path, ROOT)} for f in scandir(dirpath) if f.is_dir()]
        files = [{"name": f.name, "path": path.relpath(f.path, ROOT)} for f in scandir(dirpath) if f.is_file()]
        
        data = {
            "directories": directories,
            "files": files
        }
        
        return Response(data, status=status.HTTP_200_OK)


