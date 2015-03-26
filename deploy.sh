#!/usr/bin/expect -f
spawn ssh couch@api.adam-holt.co.uk -o StrictHostKeyChecking=no
expect "assword:"
send "Adam15\r"
set timeout 10
send "cd localer"
set timeout 1
send "forever stop server.js"
set timeout 2
send "git pull origin master"
set timeout 10
send "forever start server.js"
set timeout 4
send "exit"
