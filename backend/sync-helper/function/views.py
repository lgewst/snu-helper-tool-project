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
    while i <= e:
        if code == CODE[i]:
            return i
        i += 1
    return None

def get_code(path, version):
    p = Popen(f"git show {version}:{path}", shell=True, stdout=PIPE, stderr=PIPE)
    stdout, stderr = p.communicate()
    error = str(stderr, 'utf-8')
    
    if "Invalid object name" in error:
        return {"message": f"Invalid version '{version}'"}
    elif "Path" in error:
        return {"message": f"Path '{path}' dose not exist in '{version}'"}
    elif error != '':
        return {"message": error.replace("fatal: ", "")}
    
    return [''] + str(stdout, 'utf-8').split("\n")

def get_diff(CODE_LEFT, CODE_RIGHT, F2L_LEFT, F2L_RIGHT, origin_fname):
    s1 = e1 = -1
    for i in range(1, len(CODE_LEFT)):
        if origin_fname in F2L_LEFT[i]:
            s1 = e1 = i
            while e1 + 1 < len(CODE_LEFT) and origin_fname in F2L_LEFT[e1+1]:
                e1 += 1
            break

    s2 = e2 = -1
    for i in range(1, len(CODE_RIGHT)):
        if origin_fname in F2L_RIGHT[i]:
            s2 = e2 = i
            while e2 + 1 < len(CODE_RIGHT) and origin_fname in F2L_RIGHT[e2+1]:
                e2 += 1
            break

    left_code = []
    right_code = []

    l1 = s1
    l2 = s2
    idx = 0
    while l1 <= e1 or l2 <= e2:
        if l1 <= e1 and l2 <= e2 and CODE_LEFT[l1] == CODE_RIGHT[l2]:
            left_code.append({"index": idx, "line": l1, "content": CODE_LEFT[l1], "type": "no change"})
            right_code.append({"index": idx, "line": l2, "content": CODE_RIGHT[l2], "type": "no change"})
            l1 += 1
            l2 += 1
            idx += 1
        else:
            nxt1 = comp(CODE_RIGHT[l2], l1, e1, CODE_LEFT)
            if nxt1 != None:
                while l1 < nxt1:
                    left_code.append({"index": idx, "line": l1, "content": CODE_LEFT[l1], "type": "deleted"})
                    right_code.append({"index": idx, "line": 0, "content": "", "type": "none"})
                    l1 += 1
                    idx += 1
                continue
            
            nxt2 = comp(CODE_LEFT[l1], l2, e2, CODE_RIGHT)
            if nxt2 != None:
                while l2 < nxt2:
                    left_code.append({"index": idx, "line": 0, "content": "", "type": "none"})
                    right_code.append({"index": idx, "line": l2, "content": CODE_RIGHT[l2], "type": "inserted"})
                    l2 += 1
                    idx += 1
                continue
            
            left_code.append({"index": idx, "line": l1, "content": CODE_LEFT[l1], "type": "deleted"})
            right_code.append({"index": idx, "line": l2, "content": CODE_RIGHT[l2], "type": "inserted"})
            l1 += 1
            l2 += 1
            idx += 1
    
    return left_code, right_code


# Create your views here.
class FunctionViewSet(viewsets.GenericViewSet):

    # GET /functions/later
    @action(detail=False, methods=['GET'], url_path='later')
    def later(self, request):
        if not Chromium.INITIALIZED:
            raise InitializeException()

        origin_fname = request.query_params.get('func')
        if origin_fname is None:
            return Response({"message": "Send 'func'"}, status=status.HTTP_400_BAD_REQUEST)
        fname = origin_fname.split("::")[-1]
        path = request.query_params.get('path')
        if path is None:
            return Response({"message": "Send 'path'"}, status=status.HTTP_400_BAD_REQUEST)
        file_extension = path.split('.')[-1]
        later_version = request.query_params.get('later_version')
        if later_version is None:
            return Response({"message": "Send 'later_version'"}, status=status.HTTP_400_BAD_REQUEST)
        target_version = Chromium.target_version
        ROOT = Chromium.chromium_repo

        os.chdir(ROOT)
        CODE_LEFT = get_code(path, target_version)
        if type(CODE_LEFT) == dict:
            return Response(CODE_LEFT, status=status.HTTP_400_BAD_REQUEST)

        CODE_RIGHT = get_code(path, later_version)
        if type(CODE_RIGHT) == dict:
            return Response(CODE_RIGHT, status=status.HTTP_400_BAD_REQUEST)

        p = Popen(f"git log {target_version}..{later_version} -L:{fname}:{path}", shell=True, stdout=PIPE, stderr=PIPE)
        stdout, stderr = p.communicate()
        msg = str(stdout, 'utf-8')
        error = str(stderr, 'utf-8')

        if error != '':
            return Response({"message": f"function '{fname}': no match"}, status=status.HTTP_400_BAD_REQUEST)

        F2L_LEFT = read_function_code(CODE_LEFT, file_extension)
        F2L_RIGHT = read_function_code(CODE_RIGHT, file_extension)

        data = {"name": origin_fname, "path": path, "target_version": target_version, "later_version": later_version}
        data["target_version_code"], data["later_version_code"] = get_diff(CODE_LEFT, CODE_RIGHT, F2L_LEFT, F2L_RIGHT, origin_fname)
        
        logs = []
        commits = []

        if msg == "":
            # no change
            data["comment"] = "no change"
        else:
            commits = msg.split("\n\ncommit ")

        # add lastest commit of target_version
        commits.append(os.popen(f"git log -n 1 {target_version}").read())
        
        for i, cmsg in enumerate(commits):
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
            commit_msg = Chromium_msg(commit_id) if i < len(commits) - 1 else target_version
            logs.append({'commit_id': commit_id, 'commit_url': c_url, 'review_url': r_url, 'author_url': a_url,
                            'author_name': author_name, 'author_email': author_email, 'date': date,
                            'commit_msg': commit_msg})
    
        data["left_id"] = logs[-1]['commit_id']
        data["right_id"] = logs[0]['commit_id']
        data["logs"] = logs

        return Response(data, status=status.HTTP_200_OK)


    # GET /functions/diff
    @action(detail=False, methods=['GET'], url_path='diff')
    def diff(self, request):
        if not Chromium.INITIALIZED:
            raise InitializeException()

        origin_fname = request.query_params.get('func')
        if origin_fname is None:
            return Response({"message": "Send 'func'"}, status=status.HTTP_400_BAD_REQUEST)
        fname = origin_fname.split("::")[-1]
        path = request.query_params.get('path')
        if path is None:
            return Response({"message": "Send 'path'"}, status=status.HTTP_400_BAD_REQUEST)
        file_extension = path.split('.')[-1]

        left_id = request.query_params.get('left_id')
        if left_id is None:
            return Response({"message": "Send 'left_id'"}, status=status.HTTP_400_BAD_REQUEST)
        right_id = request.query_params.get('right_id')
        if right_id is None:
            return Response({"message": "Send 'right_id'"}, status=status.HTTP_400_BAD_REQUEST)
        
        ROOT = Chromium.chromium_repo

        os.chdir(ROOT)
        CODE_LEFT = get_code(path, left_id)
        if type(CODE_LEFT) == dict:
            return Response(CODE_LEFT, status=status.HTTP_400_BAD_REQUEST)

        CODE_RIGHT = get_code(path, right_id)
        if type(CODE_RIGHT) == dict:
            return Response(CODE_RIGHT, status=status.HTTP_400_BAD_REQUEST)

        F2L_LEFT = read_function_code(CODE_LEFT, file_extension)
        F2L_RIGHT = read_function_code(CODE_RIGHT, file_extension)

        data = {"name": origin_fname, "path": path, "left_id": left_id, "right_id": right_id}
        data["left_code"], data["right_code"] = get_diff(CODE_LEFT, CODE_RIGHT, F2L_LEFT, F2L_RIGHT, origin_fname)

        return Response(data, status=status.HTTP_200_OK)
