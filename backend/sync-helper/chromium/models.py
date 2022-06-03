from django.db import models
import os
import datetime

from chromium.parse_url import *
from chromium.crawling import find_index
from readfunc.readfunc import read_function
from commitmsg import commitmsg

# static class
class Chromium():
    INITIALIZED =       False
    WEBOS, CHROM =      0, 1
    NORM, CURR, INCM =  0, 1, 2
    chromium_repo =     "/home/seunghan/chromium/src/"
    webosose_repo =     "/home/seunghan/chromium91/"
    current_version =   "91.0.4472.0"
    target_version =    "92.0.4515.0"
    webos_patch =       "7cef9376f8f6f59d7dc8f572716c1aaf28b3d9b2"
    chromium_patch =    ""
    conflicts = []
    blames = {}
    diff_cache = {}
    related_commits = {}

    def init():
        Chromium.blames = {}
        Chromium.diff_cache = {}
        Chromium.conflicts = []
        Chromium.fill_conflicts()
        Chromium.chromium_patch = os.popen("git log -1 --pretty=format:\"%H\"").read().replace("\n", "")
        
        os.chdir(Chromium.webosose_repo)
        os.popen(f"git checkout {Chromium.webos_patch}")
        os.chdir(Chromium.chromium_repo)
        
        Chromium.INITIALIZED = True

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

    def set_webos_patch(id):
        if not id:
            return False
        
        Chromium.webos_patch = id
        return True

    def fill_conflicts():
        ROOT = Chromium.chromium_repo
        os.chdir(ROOT)

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
        if id in Chromium.blames.keys():
            return Chromium.blames[id]

        ROOT = Chromium.chromium_repo
        conf = Chromium.conflicts[id]
        path = os.path.relpath(conf.abs_path(), ROOT)
        start = conf.conflict_mark[0]
        end = conf.conflict_mark[2]

        f = open(Chromium.webosose_repo + "src/" + path, "r")
        print(Chromium.webosose_repo + "src/" + path)
        downstream_code = f.readlines()
        f.close()

        try:
            os.chdir(ROOT)
        except Exception as e:
            return False 

        msgs = os.popen(f"git blame -l --line-porcelain -L{start},{end} {path}").read().split('\n')[:-1]

        blame = []
        prev_rev = None
        prev_struct = {}
        index = 0
        max_index = len(msgs)
        while index < max_index:
            upstream = True
            rev = msgs[index].split(' ')[0]
            if rev == Chromium.chromium_patch:
                # webosose patch
                line_patch = Chromium.WEBOS
                upstream = False
                tmp = index
                while not '\t' in msgs[tmp]:
                    tmp += 1
                content = msgs[tmp][1:] + '\n'
                l = downstream_code.index(content)

                os.chdir(Chromium.webosose_repo + "src/")
                msgs1 = os.popen(f"git blame -l --line-porcelain -L{l},{l} {path}").read().split('\n')[:-1]
                rev = msgs1[0].split(' ')[0]
                line_number = int(msgs[index].split(' ')[2])
                author_name = msgs1[1][msgs1[1].find(' ') + 1:]
                author_email = msgs1[2][msgs1[2].find('<') + 1:-1]
                author_time = int(msgs1[3].split(' ')[1])
                author_timezone = msgs1[4].split(' ')[1][1:]
            else:
                line_patch = Chromium.CHROM
                line_number = int(msgs[index].split(' ')[2])
                author_name = msgs[index + 1][msgs[index + 1].find(' ') + 1:]
                author_email = msgs[index + 2][msgs[index + 2].find('<') + 1:-1]
                author_time = int(msgs[index + 3].split(' ')[1])
                author_timezone = msgs[index + 4].split(' ')[1][1:]
            
            if author_name.find('@') >= 1:
                author_name = author_name[:author_name.find('@')]
            if author_email.find('@') >= 2:
                tmp = author_email.split('@')
                author_email = tmp[0] + '@' + tmp[1]

            author_tzdelta = int(author_timezone[0:2]) * 3600 + int(author_timezone[2:]) * 60
            date = datetime.datetime(1970, 1, 1, 0, 0, 0) + datetime.timedelta(seconds=author_time + author_tzdelta)
            date = date.strftime("%Y-%m-%d %H:%M:%S")
            while not '\t' in msgs[index]:
                index += 1
            index += 1

            if rev == prev_rev:
                prev_struct['line_end'] = line_number
            else:
                if len(prev_struct) > 0:
                    blame.append(prev_struct)
                c_url = commit_url(rev, path, Chromium.chromium_repo) if upstream else f"https://github.com/webosose/chromium91/commit/{rev}"
                r_url = review_url(rev, Chromium.chromium_repo if upstream else Chromium.webosose_repo)
                if not upstream:
                    a_url = f"https://github.com/webosose/chromium91/commits?author={author_name.split(' ')[0]}"
                    commit_msg = commitmsg.Webos_msg(rev)
                else:
                    a_url = f"https://chromium-review.googlesource.com/q/owner:{author_email}"
                    commit_msg = commitmsg.Chromium_msg(rev)
                prev_struct = {'commit_id': rev, 'commit_url': c_url, 'review_url': r_url, 'author_url': a_url,
                               'line_start': line_number, 'line_end': line_number, 'author_name': author_name,
                               'author_email': author_email, 'date': date, 'commit_msg':commit_msg,
                               'line_patch': line_patch}
                prev_rev = rev

        blame.append(prev_struct)
        blame = list(filter(lambda x: x['author_name'] != 'Not Committed Yet', blame))
            
        Chromium.blames[id] = blame
        return blame

    def get_log(id, path, line_start, line_end, commit_number):
        msg = os.popen(f"git log -{commit_number} --pretty=format:\"%H\" -L{line_start},{line_end}:{path}").read()
        commit_msgs = msg.split('\ndiff --git')[:-1]
        return [commit_msg.split('\n')[-1] for commit_msg in commit_msgs]

    def get_repr_line(id, line_number):
        ROOT = Chromium.chromium_repo
        conf = Chromium.conflicts[id]
        path = os.path.relpath(conf.file_path, ROOT)
        file_extension = path.split('.')[-1]
        repr_line_number = line_number
        func_for_line = read_function(ROOT + path)

        for blame in Chromium.blames[id]:
            if blame['line_start'] <= line_number and line_number <= blame['line_end']:
                blame_start = blame['line_start']
                blame_end = blame['line_end']
                line_patch = blame['line_patch']
                commit_msg = blame['commit_msg']['release']
                if line_patch == Chromium.WEBOS:
                    os.chdir(Chromium.webosose_repo + "src/")
                else:
                    os.chdir(Chromium.chromium_repo)
                break

        for l in range(blame_start + 1, blame_end + 1):
            if func_for_line[l] != func_for_line[l - 1]:
                repr_line_number = l
                break

        return repr_line_number, line_patch, commit_msg


class Conflict():
    def __init__(self, repo_path, file_path, l1, l2, l3):
        self.repo_path = repo_path
        self.file_path = file_path
        self.conflict_mark = [l1, l2, l3]
    
    def abs_path(self,):
        return self.repo_path + self.file_path
