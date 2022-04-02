from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from os import scandir, path
from tree.models import *
from config.error import *

# Create your views here.

class TreeViewSet(viewsets.GenericViewSet):
    # GET /tree/dir?path=<path>
    @action(detail=False, methods=['GET'], url_path='dir')
    def directroy_list(self, request):
        DEFAULT_PATH = ""
        p = request.query_params.get('path') if request.query_params.get('path') else DEFAULT_PATH
        dirpath = chromium_repo + p

        if not path.isdir(dirpath):
            raise InvalidPathException()

        print(f"path={dirpath}")

        directories = [{"name": f.name, "path": f.path} for f in scandir(dirpath) if f.is_dir()]
        files = [{"name": f.name, "path": f.path} for f in scandir(dirpath) if f.is_file()]
        
        data = {
            "directories": directories,
            "files": files
        }
        
        return Response(data, status=status.HTTP_200_OK)
