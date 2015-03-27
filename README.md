#Localr Documentation

##Users

###Add New User:

URL:
```json
http://api.adam-holt.co.uk/users
```
METHOD: `POST`

#####(Username will be taken from the auth header)

HEADERS:
```json
{"authorization": "Basic xxxxxx", "content-type": "application/json"}
```

BODY:
```json
{
     "city": "Birmingham",
     "dob": "31.05.1991",
     "firstname": "Adam",
     "surname": "Holt",
     "email": "adamholt@me.com"
}
```

RESPONSE: `201 Created`
```json
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
```
RESPONSE: `406 Not Acceptable`
```json
{
    "code": "NotAcceptableError",
    "message": "Not all requirements supplied!"
}
```

RESPONSE: `409 Conflict`
```json
{
    "code": "ConflictError",
    "message": "User already exists!"
}
```


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

###Add Offers

URL:
```json
http://api.adam-holt.co.uk/business/offers
```
METHOD: `POST`

#####(Business will be taken from the auth header)
HEADERS:
```json
{"authorization": "Basic xxxxxx", "content-type": "application/json"}
```
BODY:
```json
{
     businessname: 'testbusiness',
     description: 'description',
     title: 'test offer',
     cost: 25
}
```
RESPONSE `201 Created`
```json
{
    "Added": "OK",
    "Offer_Title": "Friday - thursday",
    "Offer_Description": "testestest",
    "Date_Added": "Fri, 27 Mar 2015 11:25:28 GMT"
}
```

RESPONSE: `401 Unauthorized`
```json
{
    "code": "UnauthorizedError",
    "message": "You must only add your own offers"
}
```

###Get Offers
######Here a user can get all the offers available
URL:
```json
http://api.adam-holt.co.uk/business/offers/all
```
HEADERS:
```json
{"authorization": "Basic xxxxxx", "content-type": "application/json"}
```
METHOD: `GET`

RESPONSE: `200 OK`
```json
{
    "total_Offers": 2,
    "offers": [
        {
        "title": "Tuesday test - coventry",
        "description": "Tuesday test",
        "points_cost": 100,
        "businessname": "coventry",
        "last_modified": "Tue, 24 Mar 2015 10:40:53 GMT"
        },
        {
        "title": "testst - rfthurdsday",
        "description": "testestest",
        "points_cost": 20,
        "businessname": "rfthurdsday",
        "last_modified": "Thu, 26 Mar 2015 16:42:57 GMT"
        }
    ]
}
```
###Get Businesses Offers
######Here a user can get all the offers available from a specific business
URL:
```json
http://api.adam-holt.co.uk/business/offers/BUSINESS-NAME-HERE
```
HEADERS:
```json
 {"authorization": "Basic xxxxxx", "content-type": "application/json"}
```
METHOD: `GET`

RESPONSE: `200 OK`
```json
{
    "total_Offers": 1,
    "offers": [
        {
        "title": "Fridady - thursday",
        "description": "testestest",
        "businessname": "thursday",
        "last_modified": "Fri, 27 Mar 2015 11:26:00 GMT"
        }
    ]
}
```
###Redeem Offers 
######This part of the API allows users to redeem offers that they want to by supplying the 'offerTitle' in the body that is sent to the server.

URL:
```json
http://api.adam-holt.co.uk/business/offers/redeem
```
HEADERS:
```json
{"authorization": "Basic xxxxxx", "content-type": "application/json"}
```
METHOD: `PUT`

BODY: 
```json
{"offerTitle": "test offer - testbusiness"}
```

RESPONSE: `202 Accepted`

```json
{
    "Redeem": "OK",
    "username": "adam",
    "business": "tesco",
    "points_taken": 20,
    "total_points": 3890
    }
```

RESPONSE: `401 Unauthorized`

```json
{
    "code": "UnauthorizedError",
    "message": "Invalid username/password"
}
```

RESPONSE `403 Forbidden`

```json
{
    "code": "ForbiddenError",
    "message": "You don't have enough points to redeem this offer"
}
```

RESPONSE: `404 Not Found`

```json
{
    "code": "NotFoundError",
    "message": "Offer Not Found"
}
```




###Check Offers Redeemed

URL:

                http://api.adam-holt.co.uk/users/get

HEADERS:

                {"authorization": "Basic xxxxxx", "content-type": "application/json"}

METHOD: `GET`

RESPONSE: `200 OK`

                ```json
                {
                    "id": "adam5",
                    "date_joined": "Fri, 27 Mar 2015 11:08:59 GMT",
                    "last_modified": "Fri, 27 Mar 2015 11:44:02 GMT",
                    "points": 30,
                    "transactions": [
                        {
                        "transactionid": "906e1380-d476-11e4-a248-374a0843ba7b",
                        "date": "Fri, 27 Mar 2015 11:44:02 GMT",
                        "amount_of_points": 50,
                        "checked_in_at": "coventry"
                        },
                        {
                        "transactionid": "998cd2d0-d476-11e4-a248-374a0843ba7b",
                        "date": "Fri, 27 Mar 2015 11:44:17 GMT",
                        "offer": "Wednesday 2 - tesco",
                        "amount_of_points": -20,
                        "business_redeemed": "tesco"
                        }
                    ]
                }
                ```

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



