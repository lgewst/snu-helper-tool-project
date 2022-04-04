import os

from blame.blame import *
from conflict.conflict import *
from line.line import *

import linecache

def fill_blame_info(path):
    for cf in conflicts:
        current_lines = make_lines(cf.current_line, cf.file_path)
        incoming_lines = make_lines(cf.incoming_line, cf.file_path)

        blames.append(Blame(path, cf.file_path, current_lines, incoming_lines))
        print(blames[-1])
    
    return 0

def make_lines(conflict_line, file_path):
    msgs = os.popen('git blame -l -L %s %s' % (str(conflict_line)[1:-1].replace(' ', ''),
                    file_path)).read().split('\n')[:-1]
    
    lines = []
    for msg in msgs:
        rev = msg[:40]
        content = msg[msg.find(')') + 1:]
        author_info = list(filter(lambda x: x != '', msg[:msg.find(')')].split(' ')))
        line_num = author_info[-1]
        date = author_info[-4] + ' ' + author_info[-3]
        author_name = ' '.join(author_info[1:-4])
        author_name = author_name[author_name.find('(') + 1:]
        lines.append(Line(rev, author_name, date, line_num, content))

    return lines

def print_blame_info_short(path):
    for cf in conflicts:
        print('\n\n' + cf.file_path)
        print('\n[current]')
        print_lines_short(cf.current_line, cf.file_path)
        print('[incoming]')
        print_lines_short(cf.incoming_line, cf.file_path)
    
    return 0

def print_lines_short(conflict_line, file_path):
    for i in range(conflict_line[0], conflict_line[1] + 1):
        conflict_file_line = linecache.getline(file_path, i)[:-1]
        print(f"{str(i):>6s})    {conflict_file_line}")
