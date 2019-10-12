var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();
var port = 3000;

var conn = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "lucani32",
	database: "projekat1"
});

conn.connect(function(err){
	if(err) throw err;
	console.log("Imam bazu!");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
	res.append("Access-Control-Allow-Origin", ["*"]);
	res.append("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
	res.append("Access-Control-Allow-Headers", "Content-Type");
	next();
});


app.get("/hello", function(req, res){
	res.send("Hello!");
})


app.post("/login", function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	
	conn.query(
		"SELECT * FROM users WHERE usr_username=? AND usr_password=?",
		[username, password],
		function(err, result, fields){
			if(err) throw err;
			if(result.length == 0){
				var odg = {
					result: "ERR",
					message: "Invalid credentials"
				}
				res.json(odg);
				return;
			}
			var user = result[0];
			delete user.usr_password;
			
			var odg = {
				result: "OK",
				data: user
			}
			res.json(odg);
		})
});

app.post("/register", function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	if(username.length == 0 || password.length == 0) {
		var odg = {
			result: "ERR",
			message: "Unesite podatke"
		}
		res.json(odg);
		return;
	}
	else {
		conn.query("INSERT INTO users (usr_username, usr_password) VALUES (?, ?)",
		[username, password],
		function(err, result, fields){
            if(err) throw err;
            if(result.length == 0){
				var odg = {
					result: "ERR",
					message: "Invalid credentials"
				}
				res.json(odg);
				return;
			}
			res.json({
				result: "OK"
			})
		})
	}
	
});

app.post("/comments", function(req,res){
	var comment = req.body.comment;
	var usr_id = req.body.usr_id;

    conn.query("INSERT INTO komentari (kom_text, usr_id) VALUES(?,?)",
    [comment,usr_id],
    function(err, result, fields){
        if(err) throw err;
        if(result.length == 0){
            var odg = {
                result: "ERR",
                message: "Invalid credentials"
            }
            res.json(odg);
            return;
        }
        res.json({
            result: "OK"
        })
    })
});

app.get("/artikli", function(req, res){
    conn.query("SELECT modeli.mod_naziv, marke.mark_ime, modeli.mod_cena, artikli.art_naziv FROM modeli INNER JOIN marke ON marke.mark_id = modeli.mark_id INNER JOIN artikli ON artikli.art_id = marke.art_id", function(err, result, fields){
        if(err) throw err;
        var obj = {
            data: result
        }
        res.json(obj);
    })
})

app.get("/utisci", function(req,res){
    conn.query("SELECT * FROM komentari", function(err, result, fields){
        if(err) throw err;
        var obj = {
            data: result
        }
        res.json(obj);
    })
})

app.post("/utisci", function(req, res) {
	var id = req.body.kom_id
	conn.query("DELETE FROM komentari WHERE kom_id =?", [id],
	function(err, result, fields){
		if(err) throw err;
		if(result.length == 0){
			var odg = {
				result: "ERR",
				message: "Invalid credentials"
			}
			res.json(odg);
			return;
		}
		var komentar = result[0];
		
		var odg = {
			result: "OK",
			data: komentar
		}
		res.json(odg);
	})
})


app.listen(port, function(){
	console.log("Aplikacija radi na portu: " + port);
})

