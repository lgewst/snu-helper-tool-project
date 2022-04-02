import re
from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

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


