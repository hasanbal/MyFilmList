module.exports = function(firebase,ref,app){
    app.get("/register",function(req,res){
        res.render("register",{data: req.query});
    });
    app.post("/register",async function(req,res){
    
        var data = "";
        if(req.body.password != req.body.password2){
            data = "sifreler eslesmiyor";
            res.render("register",{data:data});
            return;
        }

        let snapshot = await firebase.database().ref().child("Users").child(req.body.username).orderByKey().once("value");
        if(snapshot.val() != null){
            data = "hesap var zaten";
            res.render("register",{data:data});
            return;
        }

        snapshot = await firebase.database().ref().child("Users").child(req.body.username).set({
            Password : req.body.password,
            List : {}
        });
        data = "kayit olusturuldu";
        res.render("register",{data:data});

    });

}