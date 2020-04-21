module.exports = function (curUser,ref,app) {
    app.get("/login",function(req,res){
        res.render("login",{data:req.query});
    });
    
    app.post("/login", async function(req, res){
        var data = "";
        let snapshot = await ref.child(req.body.username).child("Password").orderByKey().once("value");
        if(snapshot.val() == req.body.password){
            data.username = req.body.username;
            curUser.username = req.body.username;
            res.redirect("/"+curUser.username);
            return;
        }else{
            data = "yanlis bilgiler!!";
        }
        res.render("login",{data:data});
    });    
}