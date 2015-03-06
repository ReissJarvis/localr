describe('Localr API', function() {
    describe('Users', function() {
        beforeEach(function() {
            // create the dom elements
            var x = document.getElementsByTagName("script");
            var inputuser = document.createElement("input");
            inputuser.id = "username";
            var inputpassword = document.createElement("input");
            inputpassword.id = "userpassword";
            var userpoints = document.createElement("input");
            userpoints.id = "points"
            inputuser.value = "testcase";
            inputpassword.value = "test"
            userpoints.value = 10
            x[(x.length - 1)].appendChild(inputuser);
            x[(x.length - 1)].appendChild(inputpassword);
            x[(x.length - 1)].appendChild(userpoints);
        });
        describe('create the user', function (done){
            var response = ""
            beforeAll(function(done){
                var x = document.getElementsByTagName("script");
            var inputuser = document.createElement("input");
            inputuser.id = "username";
            var inputpassword = document.createElement("input");
            inputpassword.id = "userpassword";
            var userpoints = document.createElement("input");
            userpoints.id = "points"
            inputuser.value = "testcase";
            inputpassword.value = "test"
            userpoints.value = 10
            x[(x.length - 1)].appendChild(inputuser);
            x[(x.length - 1)].appendChild(inputpassword);
            x[(x.length - 1)].appendChild(userpoints);
                localr.setCred('users');
                response = localr.register("users");
                while (response === 'undefined'){
                    console.log(response); 
                }
                done();
            })
           it("be able to create a user", function(done) {
            console.log('creating user')
            var x = "";
            console.log(response);
            done();
        }) 
        afterAll(function(){
            document.getElementById("username").remove();
            document.getElementById("userpassword").remove();
        })    
        })
        
        describe('checkin', function() {
            beforeEach(function(){
               localr.setCred('users'); 
            })
            it("be able to checkin", function() {
                console.log("in the spy")
                console.log = jasmine.createSpy("log");
                var checkin = localr.checkin();
                spyOn(localr, "checkin").and.returnValue()
            })
            it("check points have been added", function() {})
        })
        it("be able to see where you've checked in", function() {})
        it("be able delete yourself", function() {
            localr.delete('users');
        })
        afterEach(function() {
            document.getElementById("username").remove();
            document.getElementById("userpassword").remove();
        })
    });
    it("be able to create a group", function() {})
    it("be able to delete a group", function() {})
    it("be able to join a group", function() {})
    it("Be able to get the latest offers", function() {})
    it("be able to redeem the latest offer", function() {})
    it("be able to check what offers youve redeemed", function() {})
});