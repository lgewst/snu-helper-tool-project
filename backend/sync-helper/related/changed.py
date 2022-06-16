import os

def get_changed_file_list(id, ROOT):
    try:
        os.chdir(ROOT)
    except Exception as e:
        return ""
    
    return os.popen(f"git diff-tree --no-commit-id --name-only -r  {id}").read().split("\n")[:-1]

def lcs(str1, str2):
    l1, l2 = len(str1), len(str2)
    cache = [0] * l2
    
    for i in range(l1):
        cnt = 0
        for j in range(l2):
            if cnt < cache[j]:
                cnt = cache[j]
            elif str1[i] == str2[j]:
                cache[j] = cnt + 1
    return max(cache) / l2

def compare_two_commits(id1, id2, ROOT):
    f_list1 = get_changed_file_list(id1, ROOT)
    f_list2 = get_changed_file_list(id2, ROOT)
    avg = 0.0
    for target in f_list1:
        mx = 0.0
        for fname in f_list2:
            mx = max(mx, lcs(fname, target))
        if mx == 1.0:
            return 1
        avg += mx
    return avg / len(f_list1)
