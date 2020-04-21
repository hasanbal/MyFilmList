module.exports = function(curUser,app){
    app.get("/logout",function(req,res){
        curUser.username = "guest";
        res.render("index",{curUser:curUser});
    });
}
