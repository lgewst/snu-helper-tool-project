from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from os import scandir, path, sep
from subprocess import PIPE, Popen

from chromium.models import *
from chromium.crawling import *
from config.error import *
from related.changed import *

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

        index = find_index(commit_id, author_email, Chromium.chromium_repo)
        
        data = {"commit_id": commit_id, "author_email": author_email}
        data["author_url"] = f"https://chromium-review.googlesource.com/q/owner:{author_email},{index}"
        return Response(data, status=status.HTTP_200_OK)

    # GET /author/related
    @action(detail=False, methods=['GET'], url_path='related')
    def related(self, request):
        if not Chromium.INITIALIZED:
            raise InitializeException()

        commit_id = request.query_params.get('commit_id')
        if commit_id is None:
            return Response({"message": "Send 'commit_id'"}, status=status.HTTP_400_BAD_REQUEST)
        
        author_email = request.query_params.get('author_email')
        if author_email is None:
            return Response({"message": "Send 'author_email'"}, status=status.HTTP_400_BAD_REQUEST)

        ROOT = Chromium.chromium_repo
        index = find_index(commit_id, author_email, ROOT)
        
        data = {"commit_id": commit_id, "author_email": author_email}

        if index == -1:  # webos commit
            data["commits"] = []
            return Response(data, status=status.HTTP_200_OK)

        res = get_response(get_author_page_url(max(0, index - 5), author_email))
        
        targets = []
        for i in range(0, 11):
            if i == 5:
                continue
            if res[i]['status'] == "MERGED" and res[i]["project"] == "chromium/src":
                change_id = res[i]["submission_id"]
                targets.append(get_commit_id(change_id))

        commits = []

        for id in targets:
            if compare_two_commits(id, commit_id, ROOT) >= 0.7:
                commits.append(id)

        commit_id
        commit_url = f"https://source.chromium.org/chromium/chromium/src/+/{commit_id}"
        
        data["commits"] = commits
        return Response(data, status=status.HTTP_200_OK)
