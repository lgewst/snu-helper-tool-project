import linecache

NORMAL = 0
CURRENT = 1
INCOMING = 2
AFTER_CONF = 3
not_func_name = ['if', 'else if', 'else', 'for', 'while', 'switch', 'do', '{']
other_symbol = ['private', 'public', 'const', 'static', 'ALWAYS_INLINE', 'inline']

def read_function_code(CODE, file_extension):
    # line_for_func : line range for each function (e.g. {'foo': [12, 27]})
    # func_for_line : functions for each line (e.g. {1: ['foo1', 'foo2'], 2: ['foo1']})
    line_for_func = {}
    func_for_line = {}
    normal_func_list = []
    current_func_list = []
    incoming_func_list = []
    static_func_list = []
    mode = NORMAL
    
    line_index = 1
    while line_index < len(CODE):
        line = CODE[line_index]
        if '#' in line or ('{' in line and '}' in line):
            line_index += 1
            continue
        elif '//' in line and line.split('//')[0].count(' ') == len(line.split('//')[0]):
            line_index += 1
            continue
        elif '[this]' in line and '{' in line:
            normal_func_list.append('not_func')
            if mode == CURRENT:
                current_func_list.append('not_func')
            elif mode == INCOMING:
                incoming_func_list.append('not_func')
        elif '<<<<<<' in line:
            mode = CURRENT
            static_func_list = []
            for normal_func in normal_func_list:
                static_func_list.append(normal_func)
                current_func_list.append(normal_func)
        elif '======' in line:
            mode = INCOMING
            for static_func in static_func_list:
                if static_func in current_func_list:
                    current_func_list.remove(static_func)
            for current_func in reversed(current_func_list):
                if current_func != 'not_func':
                    for i in range(line_for_func[current_func][0], line_index):
                        try:
                            func_for_line[i].append(current_func)
                        except KeyError:
                            func_for_line[i] = [current_func]

            normal_func_list = normal_func_list[:-len(current_func_list)] if len(current_func_list) > 0 else normal_func_list
        elif '>>>>>>' in line:
            mode = AFTER_CONF
            after_line_index = line_index
        elif '{' in line:
            detect_index = line_index
            eject = False
            is_namespace = False
            while not eject:
                left_bra, right_bra = 0, 0
                detect_mode = NORMAL
                while True:
                    detect_line = CODE[detect_index]
                    detect_index -= 1
                    if detect_mode == NORMAL:
                        left_bra += detect_line.count('(')
                        right_bra += detect_line.count(')')
                    if '======' in detect_line:
                        detect_mode = INCOMING
                    elif detect_mode == INCOMING and '<<<<<<' in detect_line:
                        detect_mode = NORMAL
                    if left_bra >= right_bra:
                        break

                blank_count = 0
                for letter in detect_line:
                    if letter == ' ':
                        blank_count += 1
                    else:
                        break

                detect_line = detect_line[blank_count:]
                if 'namespace' in detect_line:
                    is_namespace = True

                if detect_line.find('(') == 0:
                    func_name = detect_line[:detect_line.find('(', detect_line.find('(') + 1)].split(' ')[1]
                else:
                    try:
                        func_names = detect_line[:detect_line.find('(')].split(' ')
                        if len(func_names) == 0:
                            func_name = 'if'
                        else:
                            if left_bra == 0 or 'case' in func_names:
                                func_name = 'if'
                            else:
                                func_name = [x for x in func_names if x not in other_symbol][1]
                                if func_name == '':
                                    func_name = [x for x in func_names if x not in other_symbol][0]
                    except IndexError:
                        func_name = detect_line[:detect_line.find('(')]

                PASS = True

                if not is_namespace and '_' in func_name and not (file_extension == 'gn' or file_extension == 'gni'):
                    if '<' in func_name and func_name.find('<') < func_name.find('_'):
                        eject = True
                    else:
                        eject = False
                        PASS = False

                if PASS:
                    if func_name[0] == '~':
                        is_destructor = False
                        iter_num = 0
                        while True:
                            detect_line = CODE[detect_index]
                            detect_index -= 1
                            add_name = detect_line[:detect_line.find('::') + 2]
                            if ' ' in add_name:
                                add_name = add_name.split(' ')[-1]
                            func_name = add_name + func_name[1:]
                            if not '~' in detect_line:
                                if iter_num == 0:
                                    is_destructor = True
                                break
                            iter_num += 1
                        if is_destructor:
                            func_name = '~' + func_name

                    if '<' in func_name:
                        func_name = func_name[:func_name.find('<')]

                    if left_bra == 0  or any(x == func_name for x in not_func_name):
                        normal_func_list.append('not_func')
                        if mode == CURRENT:
                            current_func_list.append('not_func')
                        elif mode == INCOMING:
                            incoming_func_list.append('not_func')
                        eject = True

                    else:
                        line_for_func[func_name] = [detect_index + 1, 0]
                        normal_func_list.append(func_name)
                        if mode == CURRENT:
                            current_func_list.append(func_name)
                        elif mode == INCOMING:
                            incoming_func_list.append(func_name)
                        eject = True

        if len(normal_func_list) != 0 and '}' in line:
            for i in range(0, line.count('}')):
                closed_func = normal_func_list[-1]
                del normal_func_list[-1]
                if mode == CURRENT:
                    del current_func_list[-1]
                if closed_func == 'not_func':
                    continue
                else:
                    line_for_func[closed_func][1] = line_index
                    closed_func_copy = closed_func
                    for j in range(line_for_func[closed_func_copy][0], line_for_func[closed_func_copy][1] + 1):
                        try:
                            func_for_line[j].append(closed_func)
                        except KeyError:
                            func_for_line[j] = [closed_func]

            if mode == AFTER_CONF and len(current_func_list) != 0:
                for i in range(0, line.count('}')):
                    after_closed_func = current_func_list[-1]
                    del current_func_list[-1]
                    if after_closed_func == 'not_func':
                        continue
                    else:
                        line_for_func[after_closed_func][1] = line_index
                        for j in range(after_line_index, line_index + 1):
                            try:
                                func_for_line[j].append(after_closed_func)
                            except KeyError:
                                func_for_line[j] = [after_closed_func]

        line_index += 1

    for line_num in range(1, line_index):
        if not line_num in func_for_line.keys():
            func_for_line[line_num] = ['']
        else:
            func_for_line[line_num].append('')

    return func_for_line

def read_function(path):
    file_extension = path.split('.')[-1]
    CODE = [''] + open(path, "r").readlines()
    return read_function_code(CODE, file_extension)
