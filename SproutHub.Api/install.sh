#!/bin/bash
cp ./sprouthub-api.service /etc/systemd/system
systemctl daemon-reload
systemctl restart sprouthub-api
sleep 3
systemctl status sprouthub-api