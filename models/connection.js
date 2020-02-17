
// creating an object for connection
class connection{
  constructor(connectionID, connectionName, category,date,time,image,host,details){
    this._connectionID = connectionID;
    this._connectionName = connectionName;
    this._category = category;
    this._date = date;
    this._time = time;
    this._image = image;
    this._host = host;
    this._details = details;
  }

  get connectionID() {
    return this._connectionID;
  }
  set connectionID(value) {
    this._connectionID = value;
  }

  get connectionName() {
    return this._connectionName;
  }
  set connectionName(value) {
    this._connectionName = value;
  }

  get category() {
    return this._category;
  }
  set category(value) {
    this._category = value;
  }

  get image() {
    return this._image;
  }
  set category(value) {
    this._image = value;
  }

  get host() {
    return this._host;
  }
  set host(value) {
    this._host = value;
  }

  get details() {
    return this._details;
  }
  set details(value) {
    this._details = value;
  }

  get time() {
    return this._time;
  }
  set time(value) {
    this._Time = value;
  }


 get date() {
  return this._date;
  }
 set date(value) {
  this._date = value;
}
}


module.exports = connection;
