ssh couch@api.adam-holt.co.uk -o StrictHostKeyChecking=no
Localer2015/
cd localer
forever stop server.js
git pull origin master
forever start server.js