ssh couch@api.adam-holt.co.uk -o StrictHostKeyChecking=no
expect "Echo of after ssh couch@api.adam-holt.co.uk -o StrictHostKeyChecking=no"
sleep 5
send Localer2015/\r
cd localer
forever stop server.js
git pull origin master
forever start server.js