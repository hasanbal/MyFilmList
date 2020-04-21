module.exports = function(curUser, app){
    app.get('/',function(req,res){
        res.render("index",{data:curUser});
    });
}