from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from os import scandir, path, sep

from chromium.models import *
from config.error import *
from chromium.crawling import *

from readfunc.readfunc import read_function

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
        
        Chromium.init()
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
        directories += [{"name": f.name, "path": path.relpath(f.path, ROOT)} for f in scandir(dirpath) if
                        f.is_dir() and any('..' not in path.relpath(conf.abs_path(), f.path) for conf in Chromium.conflicts)]
        
        files = [{"name": f.name, "path": path.relpath(f.path, ROOT)} for f in scandir(dirpath) if
                    f.is_file() and any(path.relpath(f.path, conf.abs_path()) == "." for conf in Chromium.conflicts)]

        data = {
            "directories": directories,
            "files": files
        }
        
        return Response(data, status=status.HTTP_200_OK)

    # GET /chromium/file?path=<path>
    @action(detail=False, methods=['GET'], url_path='file')
    def file(self, request):
        if not Chromium.INITIALIZED:
            raise InitializeException()
        
        ROOT = Chromium.chromium_repo
        file_path = request.query_params.get('path')

        if not file_path or not path.isfile(ROOT + file_path):
            raise InvalidPathException()

        file_extension = file_path.split('.')[-1]
        if file_extension == 'cc' or file_extension == 'h':
            func_for_line = read_function(file_path)
        
        CODE = open(ROOT + file_path, "r").read().split("\n")
        conflicts = []

        for id in range(0, len(Chromium.conflicts)):
            c = Chromium.conflicts[id]
            if c.file_path == file_path:
                line_start = c.conflict_mark[0]
                line_end = c.conflict_mark[2]
                try:
                    code = [{"line": l, "content": CODE[l-1], "function": func_for_line[l][0]} for l in range(line_start, line_end + 1)]
                except:
                    code = [{"line": l, "content": CODE[l-1], "function": ''} for l in range(line_start, line_end + 1)]

                blame = Chromium.get_blame(id)
                conflicts.append({"id" : str(id), "code": code, "blame": blame})

        return Response({"conflicts": conflicts}, status=status.HTTP_200_OK)

    # GET /chromium/conflicts/{conflict_id}/related/?line_num=<line_num>&commit_num=<commit_num>
    @action(detail=False, methods=['GET'], url_path='conflicts/(?P<id>\w+)/related')
    def repr(self, request, id):
        if not Chromium.INITIALIZED:
            raise InitializeException()

        ROOT = Chromium.chromium_repo
        id = int(id)
        file_path = Chromium.conflicts[id].file_path
        line_num = int(request.query_params.get('line_num'))
        commit_num = int(request.query_params.get('commit_num'))

        if not file_path or not path.isfile(ROOT + file_path):
            raise InvalidPathException()
        
        commit_ids = []
        commit_urls = []
        try:
            if len(Chromium.related_commits[id][line_num]) > commit_num:
                commit_urls = Chromium.related_commits[id][line_num][:commit_num]
            else:
                repr_line_number, line_patch = Chromium.get_repr_line(id, line_num)
                commit_ids = Chromium.get_log(id, file_path, line_num, line_num, commit_num)
                if line_patch == Chromium.WEBOS:
                    commit_urls = [f"https://github.com/webosose/chromium91/commit/{commit_id}" for commit_id in commit_ids]
                else:
                    commit_urls = [commit_url(commit_id, file_path, Chromium.chromium_repo) for commit_id in commit_ids]
                Chromium.related_commits[id] = {'commit_urls': commit_urls}
        except KeyError:
            repr_line_number, line_patch = Chromium.get_repr_line(id, line_num)
            commit_ids = Chromium.get_log(id, file_path, line_num, line_num, commit_num)
            if line_patch == Chromium.WEBOS:
                commit_urls = [f"https://github.com/webosose/chromium91/commit/{commit_id}" for commit_id in commit_ids]
            else:
                commit_urls = [commit_url(commit_id, file_path, Chromium.chromium_repo) for commit_id in commit_ids]
            Chromium.related_commits[id] = {'commit_urls': commit_urls}

        return Response({"commit_urls": commit_urls}, status=status.HTTP_200_OK)
