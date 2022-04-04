from django.db import models
import os

# static class
class Chromium():
    INITIALIZED =       False
    chromium_repo =     "/home/seunghan/chromium/src/"
    webosose_repo =     "/home/seunghan/chromium91/"
    current_version =   "91.0.4472.0"
    target_version =    "92.0.4515.0"
    conflicts = []
    blames = {}

    def is_git_repo(path):
        try:
            os.chdir(path)
        except Exception as e:
            return False
        isgit = os.popen('[ -d .git ] && echo .git || git rev-parse --git-dir > /dev/null 2>&1').read()
        return isgit == ".git\n"

    def set_chromium_repo(path):
        if not path:
            return False
        if not Chromium.is_git_repo(path):
            return False
        
        Chromium.chromium_repo = path + ('/' if path[-1:] != '/' else '')
        return True

    def set_webosose_repo(path):
        if not path:
            return False
        if not Chromium.is_git_repo(path):
            return False
        
        Chromium.webosose_repo = path + ('/' if path[-1:] != '/' else '')
        return True

    def set_current_version(version):
        if not version:
            return False
        
        Chromium.current_version = version
        return True

    def set_target_version(version):
        if not version:
            return False
        
        Chromium.target_version = version
        return True

    def fill_conflicts():
        ROOT = Chromium.chromium_repo

        try:
            os.chdir(ROOT)
        except Exception as e:
            return False

        msgs = os.popen('git diff --check').read().split("\n")

        # parse git diff --check
        i = 0
        while i < len(msgs):
            if "conflict" in msgs[i]:
                file_path = msgs[i].split(":")[0]
                l1 = int(msgs[i].split(":")[1])
                l2 = int(msgs[i+1].split(":")[1])
                l3 = int(msgs[i+2].split(":")[1])
                Chromium.conflicts.append(Conflict(ROOT, file_path, l1, l2, l3))
                i += 3
            else:
                i += 1
        
        return True
    
    def get_blame(id):
        # cache??
        if id in Chromium.blames.keys():
            return Chromium.blames[id]

        ROOT = Chromium.chromium_repo
        conf = Chromium.conflicts[id]
        path = os.path.relpath(conf.file_path, ROOT)
        start = conf.conflict_mark[0]
        end = conf.conflict_mark[2]

        try:
            os.chdir(ROOT)
        except Exception as e:
            return False 

        msgs = os.popen(f"git blame -l --line-porcelain -L{start},{end} {path}")

        blame = []
        ## TODO: msgs parsing
        #
        # blame = [
        #   {
        #     "commit_id": string,
        #     "line_start": int,
        #     "line_end": int,
        #     "email": string,
        #     "date": string  // format XXXX-XX-XX XX:XX:XX (ex. "2021-01-27 01:32:55")
        #   }, ...
        # ]
        #
        ##

        Chromium.blames[id] = blame
        return blame


class Conflict():
    def __init__(self, repo_path, file_path, l1, l2, l3):
        self.repo_path = repo_path
        self.file_path = file_path
        self.conflict_mark = [l1, l2, l3]
