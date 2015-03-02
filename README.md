# localr
Users

These all assume you have set the basic auth headers and ('content-type' = 'application/json')

Add New User:

PUT - http://api.adam-holt.co.uk/users/register?username=USERNAME

Get User:

GET - http://api.adam-holt.co.uk/users/get?username=USERNAME

Check in user:

PUT - http://api.adam-holt.co.uk/users/checkin?username=USERNAME&points=POINTS

Delete User:

DEL - http://api.adam-holt.co.uk/users/delete?username=USERNAME



Businesses

These all assume you have set the basic auth headers and ('content-type' = 'application/json')

Add Business:

PUT - http://api.adam-holt.co.uk/business/register?businessname=BUSINESSNAME

Delete Business

DEL - http://api.adam-holt.co.uk/business/delete?businessname=BUSINESSNAME


Offers

These all assume you have set the basic auth headers and ('content-type' = 'application/json')

http://api.adam-holt.co.uk/business/offers/add?businessname=BUSINESSNAME&offer=OFFER&description=DESCRIPTION



FOR GETTING ALL OFFERS FROM CODIO WITH BUSINESSNAME
http://api.adam-holt.co.uk:5984/offers/_design/offers/_view/business?startkey=%22codio%22&endkey=%22codio%22


