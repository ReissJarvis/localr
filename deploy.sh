sshpass -p 'Localer2015/' couch@api.adam-holt.co.uk -o StrictHostKeyChecking=no
sleep 10
cd localer
forever stop server.js
git pull origin master
forever start server.js