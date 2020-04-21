module.exports = function(curUser, ref, app){
    app.get("/addFilm",function(req,res){
        ref.child(curUser.username).child("List").child(req.query.imdbID).set(
            {watchType:req.query.type}
        );    
    });
}