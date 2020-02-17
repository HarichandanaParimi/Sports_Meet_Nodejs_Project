var mongoose = require('mongoose');
// connectiong to the database
mongoose.connect('mongodb://localhost/sportsmeet', {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
var Schema = mongoose.Schema;
//creating a schema for users collection
var UserSchema= new mongoose.Schema({
  _userId: String,
  _password: String,
  _salt:String,
  _firstName: String,
  _lastName: String,
  _emailAddress: String,
  _address_1: String,
  _address_2: String,
  _city: String,
  _state: String,
  _country: String,
  _zipCode: String
}, {collection:'users'});

// creating a schema for UserSchema
var Users=mongoose.model('Users', UserSchema)

var getAllUsers = function(){
  return Users.find({});
}

var getUser = function(userId){
  return Users.findOne({_userId:userId});
}

var getemail = function(email){
  return Users.findOne({_emailAddress: email});
}

// adding a new user to the database
var addUser= function(newuser){
  var user = new Users(
    {
      _userId:newuser.username,_password:newuser.password,_salt:newuser.salt,_firstName:newuser.firstname ,
      _lastName:newuser.lastname,_emailAddress:newuser.email, _address_1:newuser.Address_1,
      _address_2:newuser.Address_2,_city:newuser.city,_state:newuser.state,
       _country:newuser.Country,_zipCode:newuser.Zipcode
    }
  );
  var newuserdetails= user.save();
  return newuserdetails
}

module.exports.getAllUsers = getAllUsers;
module.exports.getUser = getUser;
module.exports.addUser=addUser;
module.exports.Users=Users;
module.exports.getemail= getemail;
