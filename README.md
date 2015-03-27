#Localr Documentation

##Users

These all assume you have set the basic auth headers and ('content-type' = 'application/json')

###Add New User:

URL:

                http://api.adam-holt.co.uk/users

METHOD: `POST`

HEADERS:

                {"authorization": "Basic xxxxxx", "content-type": "application/json"}


BODY:

                {
                 "city": "Birmingham",
                 "dob": "31.05.1991",
                 "firstname": "Adam",
                 "surname": "Holt",
                 "email": "adamholt@me.com"
                }


RESPONSE: `201 Created`

                {
                "register": "OK",
                "date_joined": "Fri, 27 Mar 2015 11:08:59 GMT",
                "last_modified": "Fri, 27 Mar 2015 11:08:59 GMT",
                "nodeid": 128,
                "username": "adam5",
                "firstname": "Adam",
                "surname": "Holt",
                "city": "Birmingham",
                "dob": "31.05.1991",
                "email": "test@email.com"
                }
RESPONSE: `406 Not Acceptable`

                {
                "code": "NotAcceptableError",
                "message": "Not all requirements supplied!"
                }


RESPONSE: `409 Conflict`

                {
                "code": "ConflictError",
                "message": "User already exists!"
                }



###Get User:

url: http://api.adam-holt.co.uk/users/get?username=USERNAME

method: GET

###Check in user:

url: http://api.adam-holt.co.uk/users/checkin

method: PUT

###Delete User:

url: http://api.adam-holt.co.uk/users/delete?username=USERNAME

method: DEL

##Businesses

These all assume you have set the basic auth headers and ('content-type' = 'application/json')

###Add Business:

url: http://api.adam-holt.co.uk/business/

authorization: getBasic('testbusiness', 'test'), "content-type": "application/json"

body: points: 50, city: "coventry", address: "blahhh", postcode: "B23 5XR", longitude: 40.000, latitude: 1.020, email: "adamholt@me.com"

method: PUT

###Delete Business

url: http://api.adam-holt.co.uk/business/delete?businessname=BUSINESSNAME

method: DEL


##Offers

These all assume you have set the basic auth headers and ('content-type' = 'application/json')

http://api.adam-holt.co.uk/business/offers/add?businessname=BUSINESSNAME&offer=OFFER&description=DESCRIPTION

###Add Offers

url: http://api.adam-holt.co.uk/business/offers

headers: authorization: getBasic('testbusiness', 'test'), "content-type": "application/json"

body: businessname: 'testbusiness', description: 'description', title: 'test offer', cost: 25

method: PUT

###Get Offers

url: http://api.adam-holt.co.uk/business/offers/all

headers: authorization: getBasic('testuser', 'test'), "content-type": "application/json"

method: GET

###Get Businesses Offers

url: http://api.adam-holt.co.uk/business/offers/testbusiness

headers: authorization: getBasic('testuser', 'test'), "content-type": "application/json"

method: GET

###Redeem Offers 

url: http://api.adam-holt.co.uk/business/offers/redeem

headers:  authorization: getBasic('testuser', 'test'), "content-type": "application/json"

body: offerTitle: 'test offer - testbusiness'

method: GET

###Check Offers Redeemed

url: http://api.adam-holt.co.uk/users/get/testuser

headers: authorization: getBasic('testuser', 'test')

method: GET

##Groups

###Add Groups

url: http://api.adam-holt.co.uk/groups

headers: authorization: getBasic('testuser', 'test'), "content-type": "application/json"

body: username: "testuser", groupname: "testgroup", description: "This is a Test Group", competition: "freshers"

method: PUT

###Join Groups

url: http://api.adam-holt.co.uk/groups

headers: authorization: getBasic('testuser2', 'test'), "content-type": "application/json"

body:  username: "testuser2", groupname: "testgroup2", description: "This is a Test Group 2", competition: "freshers"

method: PUT

###Get Groups

url: http://api.adam-holt.co.uk/groups/testgroup

headers: authorization: getBasic('testbusiness', 'test'), "content-type": "application/json"

method: GET

###View Groups

url: http://api.adam-holt.co.uk/groups?competition=freshers

headers:  authorization: getBasic('testuser', 'test'), "content-type": "application/json"

method: GET



##FOR GETTING ALL OFFERS FROM CODIO WITH BUSINESSNAME
http://api.adam-holt.co.uk:5984/offers/_design/offers/_view/business?startkey=%22codio%22&endkey=%22codio%22

##READ THIS:
http://mark-kirby.co.uk/2013/creating-a-true-rest-api/



