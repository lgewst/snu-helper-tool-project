# Sync-helper Backend

## Requirements
To build our sync-helper backend, you need
- `python3 >= 3.8`
  - `Django == 4.0.3`
  - `django-debug-toolbar == 3.2.4`
  - `djangorestframework == 3.13.1`
  - `requests == 2.27.1`
  - `bs4 == 0.0.1`
  - `transformers == 4.19.2`
  - `torch == 1.9.1`
  - `sklearn == 0.0`
- `git == 2.25.1`

## Installation
We recommend you to pyenv-virtualenv to build our compiler. After cloning our source codes, run the build script to install the requirements.

```
> git clone https://github.com/lgewst/snu-helper-tool-project.git
> cd backend
> ./build.sh
```

## How to build and run
After running build script, run the run script to run server.
```
# Run
> . .venv/bin/activate
> cd sync-helper
> python3 manage.py
```

## Structure
```
sync-helper
├── chromium            # Chromium API handler
├── commitmsg           # Parse commit message
├── diff                # Diff API handler
├── function            # Function API handler
├── readfunc            # Parse function name from c++ file
├── sentence            # NLP code
├── config              # Config files
└── manage.py
```

## API Documentation
1. [Chromium](https://github.com/lgewst/snu-helper-tool-project/wiki/chromium)
2. [Diff](https://github.com/lgewst/snu-helper-tool-project/wiki/diff)
3. [Function](https://github.com/lgewst/snu-helper-tool-project/wiki/functions)
