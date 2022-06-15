from datetime import datetime
from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from os import scandir, path, sep
from subprocess import PIPE, Popen

from chromium.models import *
from chromium.crawling import *
from config.error import *

# Create your views here.
class AuthorViewSet(viewsets.GenericViewSet):

    # GET /author/url
    @action(detail=False, methods=['GET'], url_path='url')
    def url(self, request):
        if not Chromium.INITIALIZED:
            raise InitializeException()
        
        commit_id = request.query_params.get('commit_id')
        if commit_id is None:
            return Response({"message": "Send 'commit_id'"}, status=status.HTTP_400_BAD_REQUEST)
        
        author_email = request.query_params.get('author_email')
        if author_email is None:
            return Response({"message": "Send 'author_email'"}, status=status.HTTP_400_BAD_REQUEST)

        find_index(commit_id, author_email);

    # GET /author/related
    @action(detail=False, methods=['GET'], url_path='url')
    def url(self, request):
        if not Chromium.INITIALIZED:
            raise InitializeException()
