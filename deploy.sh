#!/usr/bin/expect -f
spawn ssh couch@api.adam-holt.co.uk -o StrictHostKeyChecking=no
expect "assword:"
send "Adam15\r"
set prompt {\$ $}
expect -re $prompt
send "cd localer"
expect -re $prompt
send "forever stop server.js"
expect -re $prompt
send "git pull origin master"
expect -re $prompt
send "forever start server.js"
expect -re $prompt
send "logout\r"
expect eof
