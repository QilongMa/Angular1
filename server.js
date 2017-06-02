var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(session({
    secret: 'MY-SESSION-SECRET-KEY-0099',
    resave: true,
    saveUninitialized: true
}));

var conn_str = 'mongodb://localhost:27017/marlab_db';
mongoose.connect(conn_str);

app.set('views', __dirname+'/public/views');

var admin = mongoose.Schema({
    username:String,
    password:String
});

var trainee = mongoose.Schema({
    batch:String,
    firstname:String,
    lastname:String,
    email:String,
    phone:String,
    clientcall: [{}]
});

var client = mongoose.Schema({
    client_name: String,
    date : Date
});

var adminModel = mongoose.model('admins', admin);
var traineeModel = mongoose.model('trainees', trainee);
var clientModel = mongoose.model('clients', client);

app.get('/', function (req, res) {
    res.sendFile( __dirname + '/public/index.html');
});

app.post('/api/users/login', function (req, res) {
    var name = req.body.username;
    var pwd = req.body.password;
    adminModel.findOne({username:name, password:pwd}, function (err, docs) {
        req.session.user = docs;
        console.log('You session is set here!');
        res.json(docs);
    })
});

app.use(function (req, res, next) {
    if(req.session && req.session.user){
        adminModel.findOne({username:req.session.user.username}, function (err, user) {
            if(user){
                req.user = user;
                delete req.user.password;
                req.session.user = user;
                res.locals.user = user;
            }
            next();
        });
    }
    else{
        next();
    }
});

function requireLogin(req, res, next) {
    if(!req.user){
        res.redirect('/');
    }
    else{
        next();
    }
}

app.get('/api/users/loggedIn', function (req, res) {
    if(req.session && req.session.user){
        adminModel.findOne({username:req.session.user.username}, function (err, user) {
            if(user){
                req.user = user;
                req.session.user = user;
                res.json('Verified');
            }
        });
    }
    else{
        res.json('Failed');
    }
});

app.post('/api/trainee/add', requireLogin,function (req, res) {
   var trainee = req.body;
   var client_array = trainee.clientcall.split(',');
   var myArray = [];
   for(var i = 0; i < client_array.length; i++){
       myArray[i] = {};
       myArray[i].client = client_array[i];
       myArray[i].call_date = new Date().toLocaleDateString();
   }
   trainee.clientcall = myArray;
   console.log(trainee.clientcall);
   var match = {firstname: trainee.firstname, lastname:trainee.lastname};
   var update = {firstname: trainee.firstname, lastname:trainee.lastname, email:trainee.email, phone:trainee.phone, batch:trainee.batch, clientcall:trainee.clientcall};
   traineeModel.findOne(match, function (err, user) {
       if(user) {
           console.log('User exists! : ' + user);
           traineeModel.update(match, update, {multi:true}, function (err, docs) {
               console.log('Update user info');
               if(err){
                   console.log(err);
                   return res.json('fail');
               }
               else {
                   return res.json('Success');
               }
           });
       }
       else{
           new traineeModel(trainee).save(function (err) {
               if(err){
                   console.log(err);
                   return res.json('fail to save');
               }
               else{
                   return res.json('Success');
               }
           })
       }
   });
});

app.get('/api/trainee', requireLogin, function (req, res) {
   traineeModel.find({}, function (err, docs) {
       console.log('Look for details '+docs.clientcall);

       res.json(docs);
   })
});

app.get('/logout', function (req, res) {
   req.session.destroy();
   res.json('Log out');
   // res.sendFile( __dirname + '/public/index.html');
});

app.listen(4000);
console.log('Listening to port 4000');