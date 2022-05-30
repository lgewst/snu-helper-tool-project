import requests
import os

def commit_url(id, file_path, ROOT):
    if id == '0000000000000000000000000000000000000000':
        return ""

    try:
        os.chdir(ROOT)
    except Exception as e:
        return ""
    
    # upper_id : commit hash prior to id
    upper_id = os.popen(f"git rev-list --parents -n 1 {id}").read().replace('\n', '').split(' ')[1]

    return f"https://source.chromium.org/chromium/chromium/src/+/{id}:{file_path};dlc={upper_id}"

def review_url(id, ROOT):
    if id == '0000000000000000000000000000000000000000':
        return ""

    try:
        os.chdir(ROOT)
    except Exception as e:
        return ""

    msg = os.popen(f"git rev-list --format=%B --max-count=1 {id}").read()
    
    if msg.find("Reviewed-on: ") == -1:
        return ""

    url = msg[msg.find("Reviewed-on: "):].split('\n')[0].split(" ")[1]
    return url
