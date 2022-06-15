from datetime import datetime
from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from os import scandir, path, sep
from subprocess import PIPE, Popen

from chromium.models import *
from config.error import *

# Create your views here.
class AuthorViewSet(viewsets.GenericViewSet):

    # GET /author/url
    @action(detail=False, methods=['GET'], url_path='url')
    def url(self, request):
        if not Chromium.INITIALIZED:
            raise InitializeException()

    # GET /author/related
    @action(detail=False, methods=['GET'], url_path='url')
    def url(self, request):
        if not Chromium.INITIALIZED:
            raise InitializeException()
