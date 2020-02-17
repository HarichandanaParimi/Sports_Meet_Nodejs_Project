// creating  class for UserProfile
var UserConnection = require('./../models/UserConnection');
class UserProfile{
  constructor(user,userconnections){
  this._user = user;
  this._userconnections = userconnections;
  }

  get user() {
    return this._user;
  }
  set user(value) {
    this._user = value;
  }

  get userconnections() {
    return this._userconnections;
  }
  set userconnections(value) {
    this._userconnections = value;
  }

// adding connections
  addConnection(connection,rsvp){
    var exists = 0;
    var l = 0;
    do
    {

      if(this._userconnections[l]._connection._connectionID == connection._connectionID){
          exists=1;
          this._userconnections[l]._rsvp = rsvp;
          break;
      }
      l=l+1
    }while(l < this._userconnections.length);



    if(exists == 0){
          this._userconnections.push(new UserConnection(connection,rsvp));
    }
  }

//removing connections
  removeConnection(Connection){
    var m =0;
    do {
      if(this._userconnections[m]._connection._connectionID == Connection._connectionID){
        var index = this._userconnections.indexOf(this._userconnections[m]);
        this._userconnections.splice(index,1);
      }
      m=m+1;
    }while(m< this._userconnections.length);
  }
//updating the connections
  updateConnection(UserConnection){
  
    this._userconnections.forEach(function(item){
        if(item._connection._connectionID == UserConnection._connection._connectionID){
            item._rsvp = UserConnection._rsvp;
        }
    });
  }

//returning all the user connections
  getConnections(){
    return this._userconnections;
  }

//clears the entire profile contents
  emptyProfile(){
       this._userconnections.splice(0,this.userconnections.length);
  }
}


module.exports = UserProfile;
