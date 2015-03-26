#!/bin/bash

HOST="api.adam-holt.co.uk"
USER="couch"
PASS="Localer2015/"
CMD=$@

VAR=$(expect -c "
spawn ssh -o StrictHostKeyChecking=no $USER@$HOST $CMD
match_max 100000
expect \"*?assword:*\"
send -- \"$PASS\r\"
send -- \"\r\"
sleep 5
cd localer
forever stop server.js
git pull origin master
forever start server.js
exit
expect eof
")
echo "==============="
