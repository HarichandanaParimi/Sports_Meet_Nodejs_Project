var mongoose = require('mongoose');
var ConnectionsModel= require('./connectionDB')
//connectiong to mongodb
mongoose.connect('mongodb://localhost/sportsmeet', {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
var Schema = mongoose.Schema;
//creating a schema for userprofile collection
var UserProfileSchema = new mongoose.Schema({
  _userId: String,
  _userconnectionList: [{_connectionID: Number,_connectionName: String,
                         _category: String,_date:String,
                          _time:String,_image:String,
                           _host: String,_details:String, _rsvp:String }]},
  {collection: 'userprofile'});

var Connections= ConnectionsModel.Connections;
//creating a model for UserProfileSchema
var UserProfile = mongoose.model('UserProfile', UserProfileSchema);

var getUserProfile = function(userId){
   return UserProfile.findOne({_userId:userId},{_userconnectionList:1,_id:0})
}

//adding rsvp to the database
var addRSVP = function(userId,connectionIdData,rsvp){
 return  UserProfile.updateOne({ _userId: userId,"_userconnectionList._connectionID" : {$ne: connectionIdData.connectionID}},
    { $push: { _userconnectionList: {_connectionID: connectionIdData.connectionID,_connectionName: connectionIdData.connectionName,
      _category: connectionIdData.category,_date:connectionIdData.date,
      _time:connectionIdData.time,_image:connectionIdData.image,_host:connectionIdData.host,
      _details:connectionIdData.details, _rsvp: rsvp }}});
};

//removing from the database
var deleteRSVP = function(userId,connectionID){
  return UserProfile.updateOne({_userId : userId},
      { $pull: {_userconnectionList: {_connectionID:connectionID}}});
};

//updatng RSVP in the database
var updateRSVP = function(userId, connectionID, rsvp){
return UserProfile.updateOne({_userId : userId,"_userconnectionList._connectionID": connectionID},
     {$set: {"_userconnectionList.$._rsvp": rsvp}});
};

//adding newconnectoin to the database
var addConnection = function(connection){
  return Connections.findOneAndUpdate(
     {_connectionName:connection.connectionName,_category:connection.category},
     {_userId:connection.userId,_connectionID:connection.newConnectionId,
        _connectionName:connection.connectionName,_category:connection.category,
       _date:connection.date,_time:connection.time,_image:connection.image,
        _host:connection.host,_details:connection.details},
     {upsert: true, new: true, runValidators: true});
  };

 var addUserProfile =function(userdata){
var userPro = new UserProfile({
    _userId:userdata,_userconnectionList:{},_connectionID:'',_connectionName:'',_category:'',
    _date:'',_time:'',_image:'',_host:'',_details:'',_rsvp:''
  });
  var newuserPro= userPro.save();
  console.log(newuserPro)
  return newuserPro

 }

  module.exports.getUserProfile = getUserProfile;
  module.exports.addRSVP = addRSVP;
  module.exports.updateRSVP = updateRSVP;
  module.exports.addConnection = addConnection;
  module.exports.deleteRSVP = deleteRSVP;
  module.exports.Connections=Connections;
  module.exports.addUserProfile=addUserProfile
