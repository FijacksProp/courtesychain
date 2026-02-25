#!/usr/bin/env bash
set -o errexit

python -m pip install --upgrade pip
pip install -r requirements.txt

pushd courtesy_ui
npm ci
npm run build
popd

python manage.py collectstatic --no-input
python manage.py migrate
