from django.db import models
import os

# static class
class Chromium():
    INITIALIZED =       False
    chromium_repo =     "/home/seunghan/chromium/src/"
    webosose_repo =     "/home/seunghan/chromium91/"
    current_version =   "91.0.4472.0"
    target_version =    "92.0.4515.0"

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
        
        Chromium.chromium_repo = path
        return True

    def set_webosose_repo(path):
        if not path:
            return False
        if not Chromium.is_git_repo(path):
            return False
        
        Chromium.webosose_repo = path
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

