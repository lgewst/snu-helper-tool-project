import os

from conflict.conflict import *

def fill_conflicts(path):
    try:
        os.chdir(path)
    except Exception as e:
        return -1
    repo_path = os.getcwd() + "/"

    # check .git file
    isgit = os.popen('[ -d .git ] && echo .git || git rev-parse --git-dir > /dev/null 2>&1').read()
    if False:
        return -2

    msgs = os.popen('git diff --check').read().split("\n")

    # parse git diff --check
    i = 0
    while i < len(msgs):
        if "conflict" in msgs[i]:
            file_path = msgs[i].split(":")[0]
            l1 = int(msgs[i].split(":")[1])
            l2 = int(msgs[i+1].split(":")[1])
            l3 = int(msgs[i+2].split(":")[1])
            conflicts.append(Conflict(repo_path, file_path, l1, l2, l3))
            i += 3
        else:
            i += 1
    
    return 0

