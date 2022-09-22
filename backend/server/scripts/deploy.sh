#!/bin/bash

set -e
set -x

sudo cp \
  /home/ubuntu/github/gutenbooks/backend/server/scripts/gutenwebapi.service \
  /etc/systemd/system
sudo chmod a-x /etc/systemd/system/gutenwebapi.service
sudo systemctl daemon-reload
sudo systemctl stop gutenwebapi
(cd /home/ubuntu/github/gutenbooks/backend \
  && dune build)
sudo cp \
  /home/ubuntu/github/gutenbooks/backend/_build/default/server/gutenwebapi.exe \
  /usr/local/bin/gutenwebapi
sudo chown root:root /usr/local/bin/gutenwebapi
sudo systemctl start gutenwebapi
