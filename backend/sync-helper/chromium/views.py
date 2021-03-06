from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from os import scandir, path, sep

from chromium.models import *
from config.error import *
from chromium.parse_url import *

from readfunc.readfunc import read_function
from related.sentence import sentence_similarity
from commitmsg import commitmsg

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
        if not Chromium.set_webos_patch(request.query_params.get('webos_patch_id')):
            return Response({"message": "Send 'webos_patch_id'"}, status=status.HTTP_400_BAD_REQUEST)
        
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
        if file_extension in ['gn', 'gni', 'h', 'cc']:
            func_for_line = read_function(ROOT + file_path)
        
        CODE = [''] + open(ROOT + file_path, "r").read().split("\n")
        conflicts = []
        last_conf_line = 0

        for id in range(0, len(Chromium.conflicts)):
            c = Chromium.conflicts[id]
            if c.file_path == file_path:
                line_start = c.conflict_mark[0]
                line_end = c.conflict_mark[2]
                try:
                    l = line_start
                    code = []
                    mode = Chromium.NORM
                    for l in range(line_start, line_end+1):
                        if '<<<<<<' in CODE[l]:
                            mode = Chromium.CURR
                        elif '======' in CODE[l]:
                            mode = Chromium.INCM
                        elif '>>>>>>' in CODE[l]:
                            mode = Chromium.NORM
                        tmp = {"line": l, "content": CODE[l], "function": '', "mode": mode}
                        if (l >= 2 and len(func_for_line[l]) == len(func_for_line[l-1]) + 1) or (l == 1 and len(func_for_line[l] > 1)):
                            # function declare
                            tmp["function"] = func_for_line[l][0]
                        code.append(tmp)
                    
                    if len(func_for_line[line_start + 1]) > 1 and code[1]["function"] == '':
                        fname = func_for_line[line_start + 1][0]
                        cnt = len(func_for_line[line_start + 1])

                        st = line_start
                        while st - 1 >= 1 and len(func_for_line[st - 1]) >= cnt:
                            st -= 1
                        
                        en = st
                        while '{' not in CODE[en]:
                            en += 1
                        
                        if last_conf_line < st:
                            code = [{"line": i, "content": CODE[i], "function": fname, "mode": 3} for i in range(st, en+1)] + [{"line": 0, "content": "", "function": ""}] + code
                    
                except:
                    mode = Chromium.NORM
                    code = []
                    for l in range(line_start, line_end + 1):
                        if '<<<<<<' in CODE[l]:
                            mode = Chromium.CURR
                        elif '======' in CODE[l]:
                            mode = Chromium.INCM
                        elif '>>>>>>' in CODE[l]:
                            mode = Chromium.NORM
                        code.append({"line": l, "content": CODE[l], "function": '', "mode": mode})
                
                if last_conf_line != 0:
                    code = [{"line": 0, "content": "", "function": "", "mode": 0}] + code
                
                last_conf_line = line_end
                conflicts.append({"id" : str(id), "code": code})

        return Response({"conflicts": conflicts}, status=status.HTTP_200_OK)

    # GET /chromium/blame?path=<path>
    @action(detail=False, methods=['GET'], url_path='blame')
    def blame(self, request):
        if not Chromium.INITIALIZED:
            raise InitializeException()
        
        ROOT = Chromium.chromium_repo
        file_path = request.query_params.get('path')

        if not file_path or not path.isfile(ROOT + file_path):
            raise InvalidPathException()
        
        conflicts = []
        for id in range(0, len(Chromium.conflicts)):
            c = Chromium.conflicts[id]
            if c.file_path == file_path:
                blame = Chromium.get_blame(id)
                conflicts.append({"id" : str(id), "blame": blame})

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
        reponame = Chromium.webosose_repo[Chromium.webosose_repo.find("chromium"):].replace("/", "")
        try:
            if len(Chromium.related_commits[id][line_num]) >= commit_num:
                commit_urls = Chromium.related_commits[id][line_num][:commit_num]
            else:
                repr_line_number, line_patch, current_msg = Chromium.get_repr_line(id, line_num)
                commit_ids = Chromium.get_log(id, file_path, line_num, line_num, 2 * commit_num)
                if line_patch == Chromium.WEBOS:
                    commit_urls = [f"https://github.com/webosose/{reponame}/commit/{commit_id}" for commit_id in commit_ids]
                    commit_msgs = [commitmsg.Webos_msg(commit_id, reponame) for commit_id in commit_ids]
                else:
                    commit_urls = [commit_url(commit_id, file_path, Chromium.chromium_repo) for commit_id in commit_ids]
                    commit_msgs = [commitmsg.Chromium_msg(commit_id) for commit_id in commit_ids]
                if '' in commit_msgs:
                    commit_urls = ['None']
                else:
                    related_ids, sim = sentence_similarity(current_msg, [c['release'] for c in commit_msgs])
                    commit_urls = [commit_urls[x] for x in related_ids][:commit_num] if len(related_ids) > commit_num else [commit_urls[x] for x in related_ids]
                try:
                    Chromium.related_commits[id][line_num] = commit_urls
                except KeyError:
                    Chromium.related_commits[id] = {line_num: commit_urls}
        except KeyError:
            repr_line_number, line_patch, current_msg = Chromium.get_repr_line(id, line_num)
            commit_ids = Chromium.get_log(id, file_path, line_num, line_num, 2 * commit_num)
            if line_patch == Chromium.WEBOS:
                commit_urls = [f"https://github.com/webosose/{reponame}/commit/{commit_id}" for commit_id in commit_ids]
                commit_msgs = [commitmsg.Webos_msg(commit_id, reponame) for commit_id in commit_ids]
            else:
                commit_urls = [commit_url(commit_id, file_path, Chromium.chromium_repo) for commit_id in commit_ids]
                commit_msgs = [commitmsg.Chromium_msg(commit_id) for commit_id in commit_ids]
            if '' in commit_msgs:
                commit_urls = ['None']
            else:
                related_ids, sim = sentence_similarity(current_msg, [c['release'] for c in commit_msgs])
                commit_urls = [commit_urls[x] for x in related_ids][:commit_num] if len(related_ids) > commit_num else [commit_urls[x] for x in related_ids]
            try:
                Chromium.related_commits[id][line_num] = commit_urls
            except KeyError:
                Chromium.related_commits[id] = {line_num: commit_urls}

        return Response({"response": [{"id": str(line_num), "commit_urls": commit_urls}]}, status=status.HTTP_200_OK)
