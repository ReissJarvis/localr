#!/usr/bin/expect -f
spawn ssh couch@api.adam-holt.co.uk -o StrictHostKeyChecking=no
expect "assword:"
send "Adam15\r"
set prompt {\$ $}
expect -re $prompt
send "cd localer\r"
expect -re $prompt
send "forever stop server.js\r"
expect -re $prompt
send "git pull origin master\r"
expect -re $prompt
send "forever start server.js\r"
expect -re $prompt
send "exit\r"
expect eof
