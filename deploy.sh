#!/usr/bin/expect -f
spawn ssh couch@api.adam-holt.co.uk -o StrictHostKeyChecking=no
expect "assword:"
send "Adam15\r"
send "cd localer"
send "forever stop server.js"
send "git pull origin master"
send "forever start server.js"
send "exit"
