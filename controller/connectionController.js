var express = require('express');
var router = express.Router();
var connectionDB = require('./../models/connectionDB');
var userprofileDB = require('./../models/UserConnectionDB');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:true});
var userDB = require('./../models/userDB');
const { check, validationResult } = require('express-validator');
'use strict';
var crypto = require('crypto');
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

//router for connection
router.get('/connection',function(req,res){
  var userspecificnavFlag = 0
  if(req.session.theuser) {
    userspecificnavFlag= 1;
  }
    if ((Object.keys(req.query)).length != 0 ) {
  var connDetails1 = connectionDB.getConnection(req.query.id);
      connDetails1.exec().then((connDetails) => {
    if (!connDetails) // if there are no conncetion details with that connection id view error page
    {
            res.render('error',{userProfile: req.session.theuser,userspecificnavFlag:userspecificnavFlag});
    }
    else{
      res.render('Connection',{connDetails: connDetails,userspecificnavFlag:userspecificnavFlag,userProfile:req.session.theuser});
    }
  })
  .catch((err) => { console.log(err); });
}
  else {

    return res.render('/Connections');
  }
});


// router  for login
router.get('/login', function (req, res) {
  var userspecificnavFlag = 0;
  if(req.session.theuser) {
    userspecificnavFlag = 1;
  }
    var message = req.flash('error');
    if(message.length >0){
      message = message[0];
    }else{
      message = null;
    }
    res.render('Login',{userspecificnavFlag:userspecificnavFlag,errorMessage: message});
});

//  this post method is called when the user submits the login button of the login form
router.post('/login',urlencodedParser,[check('password').isLength({min:6, max:15})
.withMessage('Password must be atleast 6 charactes'),
check('username').isAlphanumeric().trim().withMessage('username must be alphanumneric')],
function(req,res)
{
  var userspecificnavFlag = 1;
  var username= req.body.username;
  var password=req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    userspecificnavFlag=0
    return res.status(422).render('login',{errorMessage:errors.array()[0].msg,
    userspecificnavFlag:userspecificnavFlag})
  }
   userDB.getUser(req.body.username).exec().then((userdata) =>
  {
      if(userdata)
      {
        var salt= userdata._salt
        var hashpassword = sha512(password,salt)
        var hs=hashpassword.passwordHash
        if (hs == userdata._password){
        req.session.theuser = userdata;
        userprofileDB.getUserProfile((req.session.theuser)._userId).exec().then((userconnections) =>
        {
          if(userconnections){
          res.render("savedConnections",{userProfile: req.session.theuser, userconnections:userconnections._userconnectionList, userspecificnavFlag:userspecificnavFlag});
        }
        else{
          res.render("savedConnections",{userProfile: req.session.theuser, userconnections:'', userspecificnavFlag:userspecificnavFlag});
        }
      }).catch((err) => { console.log(err); });
      }


       else{
         userspecificnavFlag = 0
         res.render('login',{errorMessage:'username or password incorrect',
         userspecificnavFlag:userspecificnavFlag})
       }}
      else{
         userspecificnavFlag = 0
         res.render('login',{errorMessage:'username or password incorrect',
         userspecificnavFlag:userspecificnavFlag})
          }
       }).catch((err) => { console.log(err);})
  });


 router.get('/signup',function(req,res){
    userspecificnavFlag=0
    res.render('signup',{userspecificnavFlag:userspecificnavFlag,errorMessage:'', userdata:''})
  }
  );

// validating password
  var passwordcheck = function(val1){
    var  regex = /[`&()[\]{}"',~%^.*+=;:<>/]+/;
    var regex1 = /[a-z]+/;
    var regex2 = /[A-Z]+/;
    var regex3 = /[0-9]+/;
    var regex4 = /[_!@#]+/;
    if(!regex.test(val1)) // password should not contain special characters as given in the list regex
    {
      if(regex1.test(val1) && regex2.test(val1) && regex3.test(val1) && regex4.test(val1)){
        return val1
      }
     else{
          throw new Error("password should contain atleast one capital and small case letter,number, and special characters from (_!@#) ");}
    } else{
      throw new Error('Password fields consists of special characters');}
  }

//this method is called when signup button of the signup page is clicked
router.post('/signup',urlencodedParser,
check('email').isEmail().normalizeEmail().withMessage('please enter valid email'),
check('password').isLength({min:6, max:15}).withMessage('password should be atleast 6 charachetrs')
.custom((value, {req}) => {return passwordcheck(req.body.password)}),
check('firstname').isAlpha().trim().withMessage('firstname should contain only letters'),
check('lastname').isAlpha().trim().withMessage('lastname should contain only letters'),
 function(req,res){
 var username= req.body.username
 var password= req.body.password
 var salt=genRandomString(password.length)
 var hashpassword = sha512(password,salt)
 var hs=hashpassword.passwordHash
 var firstname= req.body.firstname
 var lastname= req.body.lastname
 var email= req.body.email
 var Address_1= req.body.Address_1
 var Address_2= req.body.Address_2
 var city= req.body.city
 var state= req.body.state
 var Country= req.body.Country
 var Zipcode=req.body.Zipcode
 var userspecificnavFlag=0
 const errors = validationResult(req)
 var newuser={username:username,password:hs,salt:salt,firstname:firstname,lastname:lastname,
 email:email,Address_1:Address_1,Address_2:Address_2,city:city,state:state,
Country:Country,Zipcode:Zipcode}
   if (!errors.isEmpty())
     {
     return res.status(422).render('signup',{errorMessage:errors.array()[0].msg,
     userdata:newuser,userspecificnavFlag:userspecificnavFlag})
    }
    else{
      userDB.getUser(req.body.username).exec().then((userdata) =>
     {
         if(userdata){
           res.render('signup',{errorMessage:'user already exists',userdata:req.body,
           userspecificnavFlag:userspecificnavFlag})
         }
         else{
           userDB.getemail(req.body.email).exec().then((useremail) =>
           {
             if(useremail){
               res.render('signup',{errorMessage:'user with this email already exists',userdata:req.body,
               userspecificnavFlag:userspecificnavFlag})
             }
             else{
   userDB.addUser(newuser)
   userprofileDB.addUserProfile(req.body.username)
       return res.redirect('/Login');
   }
 })
}})
}})
// this method is called when create connection of the newconnection page is clicked
router.post('/connections',urlencodedParser,
[check('category').isAlphanumeric().trim()
.withMessage('**Please enter category in alphanumeric format**'),
check('connectionName').isAlphanumeric().trim()
.withMessage('**Please enter category in alphanumeric format**'),
check('details').isLength({max:100})
.withMessage('**Details has to be alphanumeric and the maximum lenth is 100 characters**'),
check('date').isAfter().withMessage('Please enter a future date')],
function(req,res){
  var category=req.body.category
  var connectionName=req.body.connectionName
  var details=req.body.details
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    userspecificnavFlag=1
    return res.status(422).render('newConnection',{userProfile:req.session.theuser, errorMessage:errors.array()[0].msg,
    userspecificnavFlag:userspecificnavFlag,data:req.body})
  }
  console.log(req.session.theuser)
  var userId = (req.session.theuser)._userId;
  var connectionName = req.body.connectionName;
  var category = req.body.category;
  var date=req.body.date;
  var time=req.body.time;
  var details = req.body.details;
  var image;
  if (category == 'chess')
  {
     image="../assets/images/chess1.png"
  }
  else if (category === 'Football')
  {
     image="../assets/images/football1.jpg"
  }
  else
  {
     image="../assets/images/sportsclub.jpg"
  }
  var host=(req.session.theuser)._firstName;
  connectionDB.getPreviousConnectionID().exec().then((value) => {
    var previousConnectionID = value[0]._connectionID;
    var newConnectionId=previousConnectionID+1
    var connection={userId:userId,newConnectionId:newConnectionId,connectionName:connectionName,category:category,
    date:date,time:time,image:image,host:host,details:details}
    userprofileDB.addConnection(connection).exec().then((connectionadded) => {
        return res.redirect('/connections');
    }).catch((err) => { console.log(err); });
  }).catch((err) => { console.log(err); });
});


router.get('/connections',function(req,res){
  var userspecificnavFlag = 0;
  if(req.session.theuser) {
    userspecificnavFlag = 1;
  }
  var allConns = connectionDB.getConnections();
  var allCat = connectionDB.getAllCategories();
   allConns.exec().then((allConnections) => {
    allCat.exec().then((allcategories) => {
      var uniqueCategories = [];
      allcategories.forEach(function(connection){
      if (!uniqueCategories.includes(connection._category)) {
          uniqueCategories.push(connection._category);
        }
      });

      res.render('Connections', {allConnections:allConnections, allCategories:uniqueCategories,userspecificnavFlag:userspecificnavFlag,userProfile: req.session.theuser});
    }).catch((err) => { console.log(err); });
  }).catch((err) => { console.log(err); });
});

module.exports = router;
