var express = require('express');
var http = require('http');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();

/**
 * to parse the components in form
 */
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * use to formate date
 */
var dateformat = require('dateformat');
var now = new Date();

/**
 * This is view engine 
 * Template parsing
 * We are using EJS types
 */

app.set('view engine', 'ejs');

// app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
// app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js')); // redirect bootstrap JS
// app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
// app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

var connection = mysql.createConnection({
    host:'localhost',
    port:3307,
    user:'root',
    password:'22121970',
    database:'mydb'
});

connection.connect(function(error){
    if(error){
        console.log(error)
    }else{
        console.log("Connected")
    }
});

const siteTitle = "Crud app";
const baseURL = "http://localhost:3000/";


/**
 * get data on home page
 */


app.get('/',function(req,res){

    connection.query("SELECT * FROM e_events ORDER BY e_start_date",function(err,result,field){
        if(err){
            console.log(err);
        }else{
            console.log(result);
            res.render('pages/index',{
                siteTitle:siteTitle,
                pageTitle:"Inteuron",
                items:result
            });
        }
    });

});

/**
 * Add new event
 */

app.get('/event/add',function(req,res){

    res.render('pages/add-event.ejs',{
        siteTitle:siteTitle,
        pageTitle:"Inteuron",
        items:''
    });

});

app.post('/event/add',function(req,res){

 var query = "INSERT INTO `e_events` (e_name,e_start_date,e_end_date,e_date_added,e_desc,e_location) VALUES (";
    query += " '"+req.body.e_name+"',";
    query += " '"+dateformat(req.body.e_start_date,"yyyy-mm-dd")+"',";
    query += " '"+dateformat(req.body.e_end_date,"yyyy-mm-dd")+"',";
    query += " '"+dateformat(req.body.e_start_date,"yyyy-mm-dd")+"',";
    query += " '"+req.body.e_desc+"',";
    query += " '"+req.body.e_location+"')";

connection.query(query,function(err,result){
    if(err){
        console.log(err);
    }else{
        res.redirect(baseURL)
    }
});

});

/**
 * Edit data,get request
 */


app.get('/event/edit/:id',function(req,res){

    connection.query("SELECT * FROM e_events WHERE e_id = '"+req.params.id+"'" ,function(err,result,field){
        if(err){
            console.log(err);
        }else{
            console.log(result);
            result[0].e_start_date =dateformat(result[0].e_start_date,"yyyy-mm-dd");
            result[0].e_end_date =dateformat(result[0].e_end_date,"yyyy-mm-dd");
            res.render('pages/edit_event',{
                siteTitle:siteTitle,
                pageTitle:"Inteuron",
                item:result
            });
        }
    });

});

/**
 * Edit data,post request
 */

app.post('/event/edit/:id',function(req,res){

    var query = "UPDATE `e_events` SET";
       query += " `e_name` = '"+req.body.e_name+"',";
       query += "`e_start_date` =  '"+dateformat(req.body.e_start_date,"yyyy-mm-dd")+"',";
       query += "`e_end_date` =  '"+dateformat(req.body.e_end_date,"yyyy-mm-dd")+"',";
       query += "`e_date_added` =  '"+dateformat(req.body.e_start_date,"yyyy-mm-dd")+"',";
       query += "`e_desc` = '"+req.body.e_desc+"',";
       query += "`e_location` = '"+req.body.e_location+"'";
       query += "WHERE `e_events`.`e_id` = "+req.body.e_id+"";
   
   connection.query(query,function(err,result){
       if(err){
           console.log(err);
       }else{
           res.redirect(baseURL)
       }
   });
   
   });


   /**
 * DElete data,get request
 */

app.get('/event/delete/:id',function(req,res){

    connection.query("DELETE FROM e_events WHERE e_id = '"+req.params.id+"'" ,function(err,result,field){
        if(err){
            console.log(err);
        }else if(result.affectedRows){
            res.redirect(baseURL);
        }
    });

});

app.listen(3000, () => {
    console.log("App is running on port" + 3000);
});
