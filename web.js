
var mysql = require('mysql');

var mysqlConfig = {

	host : "127.0.0.1",
	port : "3306",
	user : "root",
	password : "tksfla0712@",
	database : "sanheo"

};

var conn = mysql.createConnection(mysqlConfig);



var http = require('http');
var url = require('url');

var server = http.createServer();

server.listen(3000, function(){
    console.log('Start Server Listen...');
});


/*
    
*/

server.on('request', function(req, res){
    console.log('on request');
    // if( req.method != 'POST' ){
    //     return;
    // }
    req.on('data', function(chunk){

        var data =  JSON.parse(chunk);
        console.log('--------client request start--------');
        console.log(data);
        console.log('--------client request end--------');

        res.write('{');                
        var headerCode = addJsonInt('code',data.code);                                        
        res.write(headerCode);

        /**/
        if(data.code == 1){

            conn.query("SELECT name,score FROM 'record' order by score desc",function (err,results){
                if(err){
                    console.log("failed...");
                    console.log(err);
                }
                var num =0;
                for(var i in results){
                    num++;
                    var result = results[i];
                    var keyName = 'record' + num;
                    res.write(',' + addJsonChar(keyName,result.name));    
                    var keyScore = 'score' + num;
                    res.write(',' + addJsonInt(keyScore,result.score));    
                }
                
                res.write(',' + addJsonInt('count',num));                
                res.end('}');
            });
        }
        else if(data.code ==2){

            var strQuery = 'INSERT INTO rank (name,score) VALUES ("'+data.name+'", '+data.score+')';
            conn.query(strQuery,function (err,results){    
                if(err){
                    console.log("failed...");
                    console.log(err);
                }
                res.end('}');
            });

        }

        /**/





        

    });
});







//function

function addJsonInt(key,value){

    key = '"' +key+ '":';    
    var jsonStr = key + value;

    return jsonStr;
}

function addJsonChar(key,value){

    key   = '"' +key+ '":';    
    value = '"' + value + '"';
    var jsonStr = key + value;

    return jsonStr;
}










