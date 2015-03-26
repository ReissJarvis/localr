ssh couch@api.adam-holt.co.uk
Localer2015/
yes
cd localer
forever stop server.js
git pull origin master
forever start server.js