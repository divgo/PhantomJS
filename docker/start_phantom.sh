#!/bin/sh
 $name = cat /etc/hostname
# /usr/local/share/phantomjs/bin/
phantomjs /usr/local/share/phantomjs/runner.js $1 $name

ls /usr/local/share/phantomjs -al