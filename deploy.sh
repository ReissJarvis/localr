#!/usr/bin/expect -f
spawn ssh couch@api.adam-holt.co.uk -o StrictHostKeyChecking=no
expect "password:"
sleep 1
send "Localer2015/\r"
sleep 5
cd localer
forever stop server.js
git pull origin master
forever start server.js
exit
