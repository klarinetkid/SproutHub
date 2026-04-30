#!/bin/bash
cp ./sprouthub-rpi-listener.service /etc/systemd/system
systemctl daemon-reload
systemctl restart sprouthub-rpi-listener
sleep 3
systemctl status sprouthub-rpi-listener