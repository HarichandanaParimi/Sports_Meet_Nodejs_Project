var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sportsmeet', {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
var Schema = mongoose.Schema;

// creating a schema for connections collection
var ConnectionSchema= new mongoose.Schema({
   _userId:String,
  _connectionID: Number,
  _connectionName:String,
  _category: String,
  _date:String,
  _time:String,
  _image:String,
  _host: String,
  _details: String
}, {collection:'connections'});

// creating a model for connectionschema
var Connections=mongoose.model('Connections', ConnectionSchema)

var getConnections=function(){
  return Connections.find({});
}

var getConnection = function(connectionID){
  return Connections.findOne({_connectionID:connectionID});
}

var getPreviousConnectionID = function(){
  return Connections.find({},{_connectionID:1,_id:0}).sort({_connectionID: -1}).limit(1);
}

var getAllCategories = function(){
  return Connections.find({},{_category:1,_id:0});
}

module.exports.Connections=Connections
module.exports.getConnections = getConnections;
module.exports.getConnection = getConnection;
module.exports.getPreviousConnectionID = getPreviousConnectionID;
module.exports.getAllCategories = getAllCategories;
