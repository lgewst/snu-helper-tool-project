import requests
from bs4 import BeautifulSoup
import json


# chromium 용
def Chromium_msg(commitId):
    req = requests.get('https://chromium.googlesource.com/chromium/src/+/'+commitId)

    html = req.text
    soup = BeautifulSoup(html, 'html.parser')

    commitMessage = soup.find('pre','MetadataMessage')
    if commitMessage == None: 
        return {'release':"", 'detail':""}
    commitMessage =  commitMessage.text
    commitMessages = commitMessage.splitlines()
    return {'release': commitMessages[0], 'detail': commitMessages[2]+'\n'+commitMessages[3] if len(commitMessages) >= 4 else ""}

# LG용
def Webos_msg(commitId, reponame):
    req = requests.get(f'https://github.com/webosose/{reponame}/commit/'+commitId)
    html = req.text
    soup = BeautifulSoup(html, 'html.parser')

    commitMessage = soup.find("div", "full-commit")
    if commitMessage == None: 
            return {'release':"", 'detail':""}
    commitDetail = commitMessage.find('pre')
    if commitDetail == None: 
        return {'release':"", 'detail':""}
    commitDetail =  commitDetail.text
    RELEASE = ':Release Notes:'
    DETAIL = ':Detailed Notes:'
    TESTING = ':Testing Performed:'

    releaseIndex = commitDetail.find(RELEASE)
    detailIndex = commitDetail.find(DETAIL)
    testingIndex = commitDetail.find(TESTING)

    if releaseIndex == -1  | detailIndex == -1 | testingIndex == -1 :
         return {'release':"", 'detail':""}

    release = commitDetail[releaseIndex+len(RELEASE): detailIndex].strip()
    detail = commitDetail[detailIndex+len(DETAIL): testingIndex].strip()
    return {'release': release, 'detail': detail}
