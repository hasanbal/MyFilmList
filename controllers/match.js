module.exports = function(curUser,request, ref,firebase,app){
    app.get("/match",function(req,res){
        var data = {username: curUser.username};
        res.render("match", {data:data});
    });

    function doRequest(url) {
        return new Promise(function (resolve, reject) {
        request(url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
            resolve(body);
            } else {
            reject(error);
            }
        });
        });
    }
    app.post("/match",async function(req,res){
        var data = {msg:"", list1:[],list2:[],difference:0};

        let snapshot = await firebase.database().ref().child("Users").child(req.body.un1).orderByKey().once("value");
        if(snapshot.val() == null){
            data.msg = "wrong un1";
            res.render("match",{data:data});
            return;
        }
        snapshot = await firebase.database().ref().child("Users").child(req.body.un2).orderByKey().once("value");
        if(snapshot.val() == null){
            data.msg = "wrong un2";
            res.render("match",{data:data});
            return;
        }

        snapshot = await firebase.database().ref().child("Users").child(req.body.un1).child("List").orderByKey().once("value");
        var films1 = snapshot.val();
        if(films1 == null){
            data.msg = "null un1";
            res.render("match",{data:data});
            return;
        }

        snapshot = await firebase.database().ref().child("Users").child(req.body.un2).child("List").orderByKey().once("value");
        var films2 = snapshot.val();
        if(films2 == null){
            data.msg = "null un2";
            res.render("match",{data:data});
            return;
        }

        var list1 = [];
        var list2 = [];
        for(id in films1){
            var json = await doRequest('https://www.omdbapi.com/?i='+id+'&apikey=');
            json = JSON.parse(json);
            var jsonList = json["Genre"].split(",");
                for(var i=0; i< jsonList.length; i++){
                    var genre = jsonList[i].replace(/\s/g, '')
                    
                    if(list1[genre] == null){
                        list1[genre] = 1;
                    }else{
                        list1[genre]++;
                    }
            }
        }
        
        for(id in films2){
            var json = await doRequest('https://www.omdbapi.com/?i='+id+'&apikey=');
            json = JSON.parse(json);
            var jsonList = json["Genre"].split(",");
                for(var i=0; i< jsonList.length; i++){
                    var genre = jsonList[i].replace(/\s/g, '')

                    if(list2[genre] == null){
                        list2[genre] = 1;
                    }else{
                        list2[genre]++;
                    }
            }
        }
        var difference = 0;
        var total = 0;
        for(genre in list1){
            var cnt1 = list1[genre];
            var cnt2 = list2[genre];
            
            if(cnt2 == null)
                cnt2 = 0;

            difference += (cnt1 - cnt2) * (cnt1 - cnt2);
            total += cnt1*cnt1;
            total += cnt2*cnt2;
        
        }
        for(genre in list2){
            if(list1[genre] != null) continue;

            var cnt2 = list2[genre];

            difference += cnt2 * cnt2;
            total += cnt2*cnt2;
        }
        data.difference = difference;
        data.match = parseInt(100 - (difference / total * 100));
        data.list1 = list1;
        data.list2 = list2;
        data.un1 = req.body.un1;
        data.un2 = req.body.un2;
        data.total = total;
        
        res.render("match", {data:data});
    });
}