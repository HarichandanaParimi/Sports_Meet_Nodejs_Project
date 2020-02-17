var express = require('express');
var router = express.Router();
router.use('/assets',express.static('assets'));
var connectionDB = require('./../models/connectionDB');
var userDB = require('./../models/userDB');
var userprofileDB = require('./../models/UserConnectionDB');
var session=require('express-session');
var bodyParser=require('body-parser');
var urlencodedParser=bodyParser.urlencoded({extended:true});
router.use(session({ resave: true ,secret: 'secret' , saveUninitialized: true}));

//this is called when savedconnections is given in the router
router.get('/',function(req,res){
  var userspecificnavFlag = 1;
  if((Object.keys(req.query)).length == 0) {
  if(!req.session.theuser){
           userDB.getUser('user1').exec().then((userdata) => {
           req.session.theuser = userdata;
          userprofileDB.getUserProfile((req.session.theuser)._userId).exec().then((userconnections) => {
            res.render("savedConnections",{userProfile: req.session.theuser, userconnections:userconnections._userconnectionList, userspecificnavFlag:userspecificnavFlag});
          }).catch((err) => { console.log(err); });
        }).catch((err) => { console.log(err);})
      }
      else{
        userprofileDB.getUserProfile((req.session.theuser)._userId).exec().then((userconnections) => {
            if(userconnections){
            res.render("savedConnections",{userProfile: req.session.theuser, userconnections:userconnections._userconnectionList, userspecificnavFlag:userspecificnavFlag});
          }
          else{
        res.render("savedConnections",{userProfile: req.session.theuser, userconnections:'', userspecificnavFlag:userspecificnavFlag});
          }
        }).catch((err) => { console.log(err); });
    }
  }else{
    res.render('error',{userProfile: req.session.theuser,userspecificnavFlag:0});
  }
});


//post method when update or add RSVP is clicked
router.post('/',function(req,res){
  var userspecificnavFlag = 1;
  var rsvp = req.query.rsvp;
  var connectionID=req.query.id;
  if(req.session.theuser){
    var userId = (req.session.theuser)._userId;
      connectionDB.getConnection(req.query.id).exec().then((connDetails) => {
        if(connDetails != undefined)
      userprofileDB.updateRSVP(userId,req.query.id,req.query.rsvp).exec().then((updatedflag) => {
        if(updatedflag.n == 0){
          connectionIdData={connectionID:req.query.id,connectionName:connDetails._connectionName,category:connDetails._category,
          date:connDetails._date,time:connDetails._time,image:connDetails._image,host:connDetails._host,details:connDetails._details}
          userprofileDB.addRSVP(userId,connectionIdData,req.query.rsvp).exec().then((addconnection) => {
            if(addconnection){
              console.log("addconnection")
            return res.redirect('/savedConnections');
          }

          }).catch((err) => { console.log(err); })
        }else{
          return res.redirect('/savedConnections');
        }
      }).catch((err) => { console.log(err); });
      else{
        res.render('error',{userProfile: req.session.theuser,userspecificnavFlag:1});
      }
    }).catch((err) => { console.log(err); })
  } else{
        res.render('rsvperror',{userProfile: req.session.theuser,userspecificnavFlag:0});
  }
});


// this is called when delete button is clicked
router.get('/delete',function(req,res){
  var userspecificnavFlag = 1;
  userprofileDB.deleteRSVP(req.session.theuser._userId,req.query.id).exec().then((connections) => {
    return res.redirect('/savedConnections');
  }).catch((err) => { console.log(err); })
});


module.exports = router;
