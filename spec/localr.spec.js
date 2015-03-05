describe('Localr API', function() {
    describe('Users', function() {
        beforeEach(function() {
            // create the dom elements
            var x = document.getElementsByTagName("script");
            var inputuser = document.createElement("input");
            inputuser.id = "username";
            var inputpassword = document.createElement("input");
            inputpassword.id = "userpassword";
            inputuser.value = "testcase";
            inputpassword.value = "test"
            x[(x.length - 1)].appendChild(inputuser);
            x[(x.length - 1)].appendChild(inputpassword);
        });
        it("be able to create a user", function(done) {
            console.log('creating user')
            var x = "";
            x=localr.register("users");
            
            
            
        })
        it("be able to checkin", function() {})
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