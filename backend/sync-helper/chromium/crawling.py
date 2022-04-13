import requests
import os

def commit_url(id, file_path, ROOT):
    if id == '0000000000000000000000000000000000000000':
        return ""

    try:
        os.chdir(ROOT)
    except Exception as e:
        return False 
    
    # upper_id : commit hash prior to id
    upper_id = os.popen(f"git rev-list --parents -n 1 {id}").read().replace('\n', '').split(' ')[1]

    return f"source.chromium.org/chromium/chromium/src/+/{id}:{file_path};dlc={upper_id}"

def review_url(id, file_path):
    # TODO
    url = f"source.chromium.org/chromium/chromium/src/+/{id}"
    return url
