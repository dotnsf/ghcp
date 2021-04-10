//. settings.js
var cloudantlib = require( '@cloudant/cloudant' );

var db_url = '';
var db_username = '';
var db_password = '';
var db_name = 'ghc';

if( process.env.VCAP_SERVICES ){
  var VCAP_SERVICES = JSON.parse( process.env.VCAP_SERVICES );
  if( VCAP_SERVICES && VCAP_SERVICES.cloudantNoSQLDB ){
    db_url = VCAP_SERVICES.cloudantNoSQLDB[0].credentials.url;
    db_username = VCAP_SERVICES.cloudantNoSQLDB[0].credentials.username;
    db_password = VCAP_SERVICES.cloudantNoSQLDB[0].credentials.password;
  }
}

if( process.env.db_username ){
  db_username = process.env.db_username;
}
if( process.env.db_password ){
  db_password = process.env.db_password;
}
if( process.env.db_url ){
  db_url = process.env.db_url;
}
if( process.env.db_name ){
  db_name = process.env.db_name;
}

function insertQueryIndex(){
  if( exports.db ){
    var query_index_owner = {
      _id: "_design/library",
      language: "query",
      indexes: {
        "uuid-index": {
          index: {
            fields: [ { name: "uuid", type: "string" } ]
          },
          type: "text"
        }
      }
    };
    exports.db.insert( query_index_owner, function( err, body ){} );
  }
}

exports.db = null;
if( db_url && db_username && db_password && db_name ){
  var cloudant = cloudantlib( { url: db_url, username: db_username, password: db_password } );
  exports.db = cloudant.db.use( db_name );
  insertQueryIndex();
}