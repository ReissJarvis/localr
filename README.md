#Localr Documentation

##Users

These all assume you have set the basic auth headers and ('content-type' = 'application/json')

###Add New User:

PUT - http://api.adam-holt.co.uk/users

headers: authorization: getBasic('testuser', 'test'), "content-type": "application/json"

body: JSON.stringify(doc)

###Get User:

GET - http://api.adam-holt.co.uk/users/get?username=USERNAME

###Check in user:

PUT - http://api.adam-holt.co.uk/users/checkin

###Delete User:

DEL - http://api.adam-holt.co.uk/users/delete?username=USERNAME


##Businesses

These all assume you have set the basic auth headers and ('content-type' = 'application/json')

###Add Business:

PUT - http://api.adam-holt.co.uk/business/

authorization: getBasic('testbusiness', 'test'), "content-type": "application/json"

body: points: 50, city: "coventry", address: "blahhh", postcode: "B23 5XR", longitude: 40.000, latitude: 1.020, email: "adamholt@me.com"

###Delete Business

DEL - http://api.adam-holt.co.uk/business/delete?businessname=BUSINESSNAME



##Offers

These all assume you have set the basic auth headers and ('content-type' = 'application/json')

http://api.adam-holt.co.uk/business/offers/add?businessname=BUSINESSNAME&offer=OFFER&description=DESCRIPTION

###Add Offers

PUT - http://api.adam-holt.co.uk/business/offers

headers: authorization: getBasic('testbusiness', 'test'), "content-type": "application/json"

body: businessname: 'testbusiness', description: 'description', title: 'test offer', cost: 25

###Get Offers

GET - http://api.adam-holt.co.uk/business/offers/all

headers: authorization: getBasic('testuser', 'test'), "content-type": "application/json"

###Get Businesses Offers

GET - http://api.adam-holt.co.uk/business/offers/testbusiness

headers: authorization: getBasic('testuser', 'test'), "content-type": "application/json"

###Redeem Offers 

GET - http://api.adam-holt.co.uk/business/offers/redeem

headers:  authorization: getBasic('testuser', 'test'), "content-type": "application/json"

body: offerTitle: 'test offer - testbusiness'

###Check Offers Redeemed

GET - http://api.adam-holt.co.uk/users/get/testuser

headers: authorization: getBasic('testuser', 'test')


##Groups

###Add Groups

PUT - http://api.adam-holt.co.uk/groups

headers: authorization: getBasic('testuser', 'test'), "content-type": "application/json"

body: username: "testuser", groupname: "testgroup", description: "This is a Test Group", competition: "freshers"

###Join Groups

PUT - http://api.adam-holt.co.uk/groups

headers: authorization: getBasic('testuser2', 'test'), "content-type": "application/json"

body:  username: "testuser2", groupname: "testgroup2", description: "This is a Test Group 2", competition: "freshers"
                

###Get Groups

GET - http://api.adam-holt.co.uk/groups/testgroup

headers: authorization: getBasic('testbusiness', 'test'), "content-type": "application/json"

###View Groups

GET - http://api.adam-holt.co.uk/groups?competition=freshers

headers:  authorization: getBasic('testuser', 'test'), "content-type": "application/json"




##FOR GETTING ALL OFFERS FROM CODIO WITH BUSINESSNAME
http://api.adam-holt.co.uk:5984/offers/_design/offers/_view/business?startkey=%22codio%22&endkey=%22codio%22

##READ THIS:
http://mark-kirby.co.uk/2013/creating-a-true-rest-api/



