# Sync-helper Pre-setting
chromium open source와 webOS OSE chromium의 저장소를 로컬로 옮겨온 후 업그레이드하는 사전 작업이 필요하다.

## Part 1. Chromium Open Source
1-1) depot_tools을 로컬로 가져오기
```
> git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
```

1-2) PATH 환경 변수 설정하기
`~/.bashrc`를 편집기로 열어 아래 내용을 입력 후 저장한다.
```
export PATH=“$PATH:/path/to/depot_tools”
```

1-3) depot_tools의 fetch 툴 사용해서 Chromium 코드 다운로드하기.
```
> mkdir ~/chromium
> cd ~/chromium
> fetch --nohooks chromium
```

1-4) 특정 버전으로 불러오기
```
> git checkout 87.0.4280.88
```

1-5) 브랜치 생성하기
```
> git checkout -b <branch_name>
```

## Part2. webOS OSE Chromium
2-1) webOS OSE의 코드 다운로드하기
```
> git clone https://github.com/webosose/chromium87.git
```

2-2) 적용할 패치 생성하기
```
> cd chromium87
> git format-patch -1 <commit_id>    // ex. 75729b78817d49249cd004ef734c032269f06e53
```

2-3) 패치 적용하기
생성된 패치 파일을 1-5에서 생성한 브랜치에 적용
```
> mv <patch_file> ~/chromium/src/
> cd ~/chromium/src/
> patch -p1 < <patch_file>
```

## Part 3. Merge
3-1) 스테이지 정리하기
patch 실행 후 생긴 `.rej`파일 삭제
```
> git add .
> git commit -m <message>
```

3-2) Merge (Ex. 87.0.4280.88 > 88.0.4324.99)
```
> git merge --no-ff 88.0.4324.99
```
