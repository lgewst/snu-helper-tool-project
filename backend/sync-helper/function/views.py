from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from os import scandir, path, sep

from chromium.models import *
from config.error import *

# Create your views here.
class FunctionViewSet(viewsets.GenericViewSet):
    # GET /functions/{function_name}/later
    @action(detail=True, methods=['GET'], url_path='later')
    def later(self, request, pk):
        fname = pk
        path = request.query_params.get('path')
        later_version = request.query_params.get('later_version')
        target_version = Chromium.target_version
        ROOT = Chromium.chromium_repo

        

        os.chdir(Chromium.chromium_repo)
        msg = os.popen(f"git log {target_version}..{later_version} -L:{fname}:{path}").read()
        data = {"name": fname, "path": path, "target_version": target_version, "later_version": later_version}

        if msg == "":
            # no change
            data["comment"] = "no change"
        else:
            commits = msg.split("commit ")


        return Response(data, status=status.HTTP_200_OK)