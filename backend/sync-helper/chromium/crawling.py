import requests
import json
import datetime
import os

# Crawl https://chromium-review.googlesource.com

def get_author_page_url(S, owner):
    return f"https://chromium-review.googlesource.com/changes/?O=1000081&S={S}&n=25&q=owner:{owner}"

def get_detail_url(change_id):
    return f"https://chromium-review.googlesource.com/changes/chromium%2Fsrc~{change_id}/detail?O=1916314"

def get_response(url):
    response = requests.get(url)
    if response.status_code != 200:
        return None
    return json.loads(response.text.split("\n")[1])

keys = ['id', 'project', 'branch', 'attention_set', 'removed_from_attention_set', 'hashtags', 'change_id', 'subject', 'status', 'created', 'updated', 'submitted', 'submitter', 'insertions', 'deletions', 'total_comment_count', 'unresolved_comment_count', 'has_review_started', 'submission_id', 'meta_rev_id', '_number', 'owner', 'labels', 'removable_reviewers', 'reviewers', 'pending_reviewers', 'requirements', 'submit_records', 'submit_requirements']

# commit id to change id
def get_change_id(id, ROOT):
    try:
        os.chdir(ROOT)
    except Exception as e:
        return ""

    msg = os.popen(f"git rev-list --format=%B --max-count=1 {id}").read()
    
    if msg.find("Change-Id: ") == -1:
        return ""

    change_id = msg[msg.find("Change-Id: "):].split('\n')[0].split(" ")[1]
    return change_id

# submission id to commit id
def get_commit_id(id):
    return get_response(get_detail_url(id))["current_revision"]

def date_compare(str1, str2):
    dateFormatter = "%Y-%m-%d %H:%M:%S"
    d1 = datetime.strptime(str1, dateFormatter)
    d2 = datetime.strptime(str2, dateFormatter)

    if d1 == d2:
        return 0
    elif d1 < d2:
        return 1
    else:
        return -1

def find_index(commit_id, owner, ROOT):
    change_id = get_change_id(commit_id, ROOT)
    if change_id == "":
        return -1
    page_sz = 25
    S = 0

    while(True):
        res = get_response(get_author_page_url(S, owner))

        if res == None or res == []:
            return -1
        
        for i, e in enumerate(res):
            if e['change_id'] == change_id:
               return S + i
        S += page_sz

# for test
def f(owner):
    idx = find_index("Ifd7541c603e95aff05731ddd75874d90809d3dca", owner)
    print(f"index: {idx}")
    res = get_response(get_author_page_url(max(0, idx - 6), owner))
    for i in range(0, 11):
        if i == 6:
            continue
        print(res[i]['change_id'])

# f("ayzhao@google.com")
