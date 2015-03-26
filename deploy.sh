spawn ssh couch@api.adam-holt.co.uk -o StrictHostKeyChecking=no
expect "assword:"
send "Adam15\r"
cd localer
forever stop server.js
git pull origin master
forever start server.js
exit
