from datetime import datetime
from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from os import scandir, path, sep
from subprocess import PIPE, Popen

from chromium.models import *
from config.error import *

from readfunc.readfunc import read_function_code
from commitmsg.commitmsg import Chromium_msg

def comp(code, i, e, CODE):
    while i < e:
        if code == CODE[i]:
            return i
        i += 1
    return None

# Create your views here.
class FunctionViewSet(viewsets.GenericViewSet):

    # GET /functions/{function_name}/later
    @action(detail=True, methods=['GET'], url_path='later')
    def later(self, request, pk):
        if not Chromium.INITIALIZED:
            raise InitializeException()

        fname = pk.split("::")[-1]
        path = request.query_params.get('path')
        file_extension = path.split('.')[-1]
        later_version = request.query_params.get('later_version')
        target_version = Chromium.target_version
        ROOT = Chromium.chromium_repo

        os.chdir(ROOT)
        p = Popen(f"git log {target_version}..{later_version} -L:{fname}:{path}", shell=True, stdout=PIPE, stderr=PIPE)
        stdout, stderr = p.communicate()
        msg = str(stdout, 'utf-8')
        error = str(stderr, 'utf-8')

        if error != '':
            return Response({"message": f"function '{fname}': no match"}, status=status.HTTP_400_BAD_REQUEST)
        
        CODE_T = [''] + os.popen(f"git show {target_version}:{path}").read().split('\n')
        CODE_L = [''] + os.popen(f"git show {later_version}:{path}").read().split('\n')

        F2L_T = read_function_code(CODE_T, file_extension)
        F2L_L = read_function_code(CODE_L, file_extension)

        data = {"name": fname, "path": path, "target_version": target_version, "later_version": later_version}

        s1 = e1 = -1
        for i in range(1, len(CODE_T)):
            if fname in F2L_T[i]:
                s1 = e1 = i
                while e1 + 1 < len(CODE_T) and fname in F2L_T[e1+1]:
                    e1 += 1
                break

        s2 = e2 = -1
        for i in range(1, len(CODE_L)):
            if fname in F2L_L[i]:
                s2 = e2 = i
                while e2 + 1 < len(CODE_L) and fname in F2L_L[e2+1]:
                    e2 += 1
                break

        target_version_code = []
        later_version_code = []

        l1 = s1
        l2 = s2
        idx = 0
        while l1 <= e1 or l2 <= e2:
            if l1 <= e1 and l2 <= e2 and CODE_T[l1] == CODE_L[l2]:
                target_version_code.append({"index": idx, "line": l1, "content": CODE_T[l1], "type": "no change"})
                later_version_code.append({"index": idx, "line": l2, "content": CODE_L[l2], "type": "no change"})
                l1 += 1
                l2 += 1
                idx += 1
            else:
                nxt1 = comp(CODE_L[l2], l1, e1, CODE_T)
                if nxt1 != None:
                    while l1 < nxt1:
                        target_version_code.append({"index": idx, "line": l1, "content": CODE_T[l1], "type": "deleted"})
                        later_version_code.append({"index": idx, "line": 0, "content": "", "type": "none"})
                        l1 += 1
                        idx += 1
                    continue
                
                nxt2 = comp(CODE_T[l1], l2, e2, CODE_L)
                if nxt2 != None:
                    while l2 < nxt2:
                        target_version_code.append({"index": idx, "line": 0, "content": "", "type": "none"})
                        later_version_code.append({"index": idx, "line": l2, "content": CODE_L[l2], "type": "inserted"})
                        l2 += 1
                        idx += 1
                    continue
                
                target_version_code.append({"index": idx, "line": l1, "content": CODE_T[l1], "type": "deleted"})
                later_version_code.append({"index": idx, "line": l2, "content": CODE_L[l2], "type": "inserted"})
                l1 += 1
                l2 += 1
                idx += 1

        data["target_version_code"] = target_version_code
        data["later_version_code"] = later_version_code
        logs = []

        if msg == "":
            # no change
            data["comment"] = "no change"
        else:

            commits = msg.split("\n\ncommit ")
            
            for cmsg in commits:
                msg1 = cmsg.split("\n")
                commit_id = msg1[0].replace("commit ", "")
                author_name = msg1[1][msg1[1].find(' ') + 1:msg1[1].find('<') - 1]
                author_email = msg1[1][msg1[1].find('<') + 1:-1]
                date = msg1[2].split(' ')[3:]
                month = int(datetime.datetime.strptime(date[1], "%b").month)
                day = int(date[2])
                time = date[3]
                year = date[4]
                
                date = f"{year}-{month:02d}-{day:02d} {time}"

                c_url = commit_url(commit_id, path, Chromium.chromium_repo)
                r_url = review_url(commit_id, Chromium.chromium_repo)
                a_url = f"https://chromium-review.googlesource.com/q/owner:{author_email}"
                commit_msg = Chromium_msg(commit_id)
                logs.append({'commit_id': commit_id, 'commit_url': c_url, 'review_url': r_url, 'author_url': a_url,
                               'author_name': author_name, 'author_email': author_email, 'date': date,
                               'commit_msg': commit_msg})
        
        data["logs"] = logs
        return Response(data, status=status.HTTP_200_OK)