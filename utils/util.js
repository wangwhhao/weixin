function convertToStarsArray(stars){
    var array = [];
    var num = stars.toString().substring(0,1);
    for(var i=1;i<=5;i++){
        if(i<=num){
            array.push(1);
        }else{
            array.push(0);
        }
    }
    return array;
}

function convertTocastString(casts){
    var castsjoin = "";
    for(var idx in casts){
       castsjoin = castsjoin + casts[idx].name + "/";
    }
    return castsjoin = castsjoin.substring(0,castsjoin.length-2);
}

function convertTocastInfo(casts){
    var castsArray = [];
    for(var idx in casts){
        var cast = {
            img:casts[idx].avatars ? casts[idx].avatars.large :"",
            name:casts[idx].name
        }
        castsArray.push(cast);
    }
    return castsArray;
}

function http(url,callBack) {
        wx.request({
            url: url,
            method: 'GET', 
            header: {
                "content-type": "json"
            },
            success: function (res) {
                callBack(res.data)
            },
            fail: function (error) {
                console.log(error);
            }
        })
    }

module.exports = {
    convertToStarsArray:convertToStarsArray,
    http:http,
    convertTocastString:convertTocastString,
    convertTocastInfo:convertTocastInfo
}