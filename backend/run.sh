#!/bin/bash
. .venv/bin/activate
cd sync-helper
python3 manage.py runserver
