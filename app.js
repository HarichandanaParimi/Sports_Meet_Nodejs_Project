var express = require('express');
var app = express();
app.set('view engine','ejs');
app.use('/assets',express.static('assets'));
var bodyParser=require('body-parser');
var flash = require('connect-flash');
app.use(flash());
var userDB = require('./models/userDB');
var urlencodedParser=bodyParser.urlencoded({extended:true});
var session=require('express-session');
app.use(session({ resave: true ,secret: 'Secret' , saveUninitialized: true}));
var connectionControllerRouter = require('./controller/connectionController');
var userProfileRouter = require('./controller/profileController');
app.use('/',connectionControllerRouter);
app.use('/savedConnections',userProfileRouter);

app.get(['/index','/'],function(req,res){
  var userspecificnavFlag = 0;
  if(req.session.theuser) {
    userspecificnavFlag = 1;
  }
  res.render('Index',{userspecificnavFlag:userspecificnavFlag, userProfile:req.session.theuser});
});


app.get('/about',function(req,res){
  var userspecificnavFlag = 0;
  if(req.session.theuser) {
    userspecificnavFlag = 1;
  }
  res.render('about',{userspecificnavFlag:userspecificnavFlag, userProfile:req.session.theuser});
});

app.get('/newConnection',function(req,res){
  var userspecificnavFlag = 1;
  if(req.session.theuser) {
        console.log("inside if ")
        console.log(req.session.theuser)
        res.render('newConnection',{userspecificnavFlag:userspecificnavFlag, userProfile:req.session.theuser,errorMessage:'',data:''});
  }
  else{
  var userspecificnavFlag = 0;
  res.render('rsvperror', {userspecificnavFlag:userspecificnavFlag})
}

});


app.get('/logout',function(req,res){
  var userspecificnavFlag = 0;
  req.session.destroy(function(error){
    if (error) {
      console.log('An error has encountered while detecting the session object');
    } else {
      res.render('index',{userspecificnavFlag:userspecificnavFlag});
    }
  });
});



app.get('/contact',function(req,res){
  var userspecificnavFlag = 0;
  if(req.session.theuser) {
    userspecificnavFlag = 1;
  }
    res.render('contact',{userspecificnavFlag:userspecificnavFlag, userProfile:req.session.theuser});
});

app.get('/*', function(req, res){
  res.render('errorpage');
});

app.listen(3000, function(){
  console.log('listening to port 3000');
});
