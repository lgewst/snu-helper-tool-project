from django.db import models
import os

import datetime
import linecache

# static class
class Chromium():
    INITIALIZED =       False
    chromium_repo =     "/home/seunghan/chromium/src/"
    webosose_repo =     "/home/seunghan/chromium91/"
    current_version =   "91.0.4472.0"
    target_version =    "92.0.4515.0"
    conflicts = []
    blames = {}
    function_lines = {}

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

        Chromium.read_function(path)

        msgs = os.popen(f"git blame -l --line-porcelain -L{start},{end} {path}").read().split('\n')[:-1]

        blame = []
        prev_rev = None
        prev_struct = {}
        index = 0
        max_index = len(msgs)
        while index < max_index:
            rev = msgs[index].split(' ')[0]
            line_number = msgs[index].split(' ')[2]
            author_name = msgs[index + 1][msgs[index + 1].find(' ') + 1:]
            author_email = msgs[index + 2][msgs[index + 2].find('<') + 1:-1]
            author_time = int(msgs[index + 3].split(' ')[1])
            author_timezone = msgs[index + 4].split(' ')[1][1:]
            author_tzdelta = int(author_timezone[0:2]) * 3600 + int(author_timezone[2:]) * 60
            date = datetime.datetime(1970, 1, 1, 0, 0, 0) + datetime.timedelta(seconds=author_time + author_tzdelta)
            date = date.strftime("%Y-%m-%d %H:%M:%S")
            while not '\t' in msgs[index]:
                index += 1
            content = msgs[index][1:]
            index += 1

            if rev == prev_rev:
                prev_struct['line_end'] = line_number
                prev_struct['content'] += '\n' + content
            else:
                if len(prev_struct) > 0:
                    blame.append(prev_struct)
                prev_struct = {'commit_id': rev, 'line_start': line_number, 'line_end': line_number,
                               'author_name': author_name, 'author_email': author_email, 'date': date,
                               'content': content}
                prev_rev = rev

        blame.append(prev_struct)
            
        Chromium.blames[id] = blame
        return blame

    def read_function(path):
        line_index = 1
        not_func = ['if', 'else if', 'else', 'for', 'while', 'switch', 'do', '{']
        not_func_name = ['private', 'public', 'const', 'static', 'ALWAYS_INLINE']
        funclines = {}
        funclist = []
        line_func = {}
        current_func_list = []
        incoming_func_list = []
        NORMAL = 0
        CURRENT = 1
        INCOMING = 2
        AFTER_CONF = 3
        mode = NORMAL

        while True:
            line = linecache.getline(path, line_index)
            if line == '':
                break
            elif '[this]' in line and '{' in line:
                funclist.append('not_func')
                if mode == CURRENT:
                    current_func_list.append('not_func')
                elif mode == INCOMING:
                    incoming_func_list.append('not_func')
            elif '<<<<<<' in line:
                mode = CURRENT
            elif '======' in line:
                mode = INCOMING
                for current_func in reversed(current_func_list):
                    if current_func != 'not_func':
                        for i in range(funclines[current_func][0], line_index + 1):
                            try:
                                line_func[i].append(current_func)
                            except:
                                line_func[i] = [current_func]

                funclist = funclist[:-len(current_func_list)]
            elif '>>>>>>' in line:
                mode = AFTER_CONF
                after_line_index = line_index
            elif '{' in line:
                detect_index = line_index
                left_bra, right_bra = 0, 0
                while True:
                    detect_line = linecache.getline(path, detect_index)
                    left_bra += detect_line.count('(')
                    right_bra += detect_line.count(')')
                    if left_bra >= right_bra:
                        break
                    detect_index -= 1

                blank_count = 0
                for letter in detect_line:
                    if letter == ' ':
                        blank_count += 1
                    else:
                        break

                detect_line = detect_line[blank_count:]

                if detect_line.find('(') == 0:
                    func_name = detect_line[:detect_line.find('(', detect_line.find('(') + 1)].split(' ')[1]
                else:
                    try:
                        func_names = detect_line[:detect_line.find('(')].split(' ')
                        func_name = [x for x in func_names if x not in not_func_name][1]
                        if func_name == '':
                            func_name = [x for x in func_names if x not in not_func_name][0]
                    except IndexError:
                        func_name = detect_line[:detect_line.find('(')]

                if func_name[0] == '~':
                    detect_index -= 1
                    while True:
                        detect_line = linecache.getline(path, detect_index)
                        add_name = detect_line[:detect_line.find('::') + 2]
                        if ' ' in add_name:
                            add_name = add_name.split(' ')[-1]
                        func_name = add_name + func_name[1:]
                        if not '~' in detect_line:
                            break

                if any(x in func_name for x in not_func):
                    funclist.append('not_func')
                    if mode == CURRENT:
                        current_func_list.append('not_func')
                else:
                    funclines[func_name] = [line_index, 0]
                    funclist.append(func_name)
                    if mode == CURRENT:
                        current_func_list.append(func_name)
                    elif mode == INCOMING:
                        incoming_func_list.append(func_name)

            if len(funclist) != 0 and '}' in line:
                for i in range(0, line.count('}')):
                    closed_func = funclist[-1]
                    del funclist[-1]
                    if mode == CURRENT:
                        del current_func_list[-1]
                    if closed_func == 'not_func':
                        continue
                    else:
                        funclines[closed_func][1] = line_index
                        closed_func_copy = closed_func
                        if closed_func in incoming_func_list:
                            closed_func += '(incoming)'
                        for j in range(funclines[closed_func_copy][0], funclines[closed_func_copy][1] + 1):
                            try:
                                line_func[j].append(closed_func)
                            except:
                                line_func[j] = [closed_func]

                if mode == AFTER_CONF and len(current_func_list) != 0:
                    for i in range(0, line.count('}')):
                        after_closed_func = current_func_list[-1]
                        del current_func_list[-1]
                        if after_closed_func == 'not_func':
                            continue
                        else:
                            funclines[after_closed_func][1] = line_index
                            for j in range(after_line_index, line_index + 1):
                                try:
                                    line_func[j].append(after_closed_func + '(current)')
                                except:
                                    line_func[j] = [after_closed_func + '(current)']

            line_index += 1

        for line in sorted(line_func.items()):
            print(line)
                
        Chromium().function_lines = sorted(line_func.items())
        return 0


class Conflict():
    def __init__(self, repo_path, file_path, l1, l2, l3):
        self.repo_path = repo_path
        self.file_path = file_path
        self.conflict_mark = [l1, l2, l3]
