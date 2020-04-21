module.exports = function(curUser, app){
    app.get('/profile',function(req,res){

        var data = {username : curUser.username};
        res.redirect("/"+curUser.username);
    });
    app.get('/:username',function(req,res){
        var data = {username : req.params.username};
        res.render("profile",{data:data});
    });
    // app.get('/profile/:username',function(req,res){
    //     if(req.params.username == ''){
    //         res.render("index");
    //     }
    //     var data = {username : req.params.username};

    //     res.render("profile",{data:data});
    // });
}