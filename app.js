//. app.js
var express = require( 'express' ),
    bodyParser = require( 'body-parser' ),
    ejs = require( 'ejs' ),
    app = express();

var settings = require( './settings' );

var db = settings.db;

app.use( express.static( __dirname + '/public' ) );
app.use( bodyParser.urlencoded( { extended: true, limit: '10mb' } ) );
app.use( express.Router() );
app.use( bodyParser.json() );

app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );

app.get( '/', function( req, res ){
  res.render( 'index', {} );
});

app.get( '/commits', function( req, res ){
  var format = 'json';
  res.contentType( 'application/json; charset=utf-8' );
  if( db ){
    var uuid = req.headers['x-uuid'];
    db.find( { selector: { uuid: { "$eq": uuid } }, fields: [ "_id", "_rev", "timestamp", "uuid", "comment" ] }, function( err, result ){
      if( err ){
        res.status( 400 );
        res.write( JSON.stringify( { status: false, message: err } ) );
        res.end();
      }else{
        var ts_now = ( new Date() ).getTime();
        var obj_now = timestamp2obj( ts_now );

        var tmp_y = obj_now.y;
        var tmp_m = obj_now.m;
        var tmp_days = 365;
        if( tmp_m < 3 ){
          tmp_y --;
        }
        if( isLeapYear( tmp_y ) ){
          tmp_days ++;
        }

        var ts_year = ts_now - ( tmp_days * 24 * 60 * 60 * 1000 );
        var obj_year = timestamp2obj( ts_year );
        
        var docs = [];
        result.docs.forEach( function( doc ){
          var ts = doc.timestamp;
          if( ts_year <= ts && ts <= ts_now ){
            doc.obj = timestamp2obj( ts );
            docs.push( doc );
          }
        });

        docs.sort( compareByTimestamp );

        if( req.query.format ){
          format = req.query.format;
        }
  
        if( format == 'json' ){
          var result = { status: true, contributes: docs };
          res.write( JSON.stringify( result ) );
          res.end();
        }else if( format == 'svg' ){
          var target_date = null;
          if( req.query.target_date ){
            target_date = req.query.target_date;
          }

          var counts = [];

          //. 一年前が日曜からはじまるように調整
          var y_obj = timestamp2obj( ts_year );
          for( var i = 0; i < y_obj.day; i ++ ){
            var t_ts = ts_year - ( 24 * 60 * 60 * 1000 ) * ( y_obj.day - i );
            var t_obj = timestamp2obj( t_ts );
            var t_ymd = t_obj.ymd;
            counts.push( { ymd: t_ymd, month: t_obj.m - 1, date: t_obj.d, day: t_obj.day, comments: [], count: 0 } );
          }

          for( var i_ts = ts_year; i_ts <= ts_now; i_ts += ( 24 * 60 * 60 * 1000 ) ){
            var i_obj = timestamp2obj( i_ts );
            var i_ymd = i_obj.ymd;
            counts.push( { ymd: i_ymd, month: i_obj.m - 1, date: i_obj.d, day: i_obj.day, comments: [], count: 0 } );
            for( var j = 0; j < docs.length && docs[j].obj.ymd <= i_ymd; j ++ ){
              if( docs[j].obj.ymd == i_ymd ){
                if( docs[j].comment ){
                  counts[counts.length-1].comments.push( docs[j].comment );
                }
                counts[counts.length-1].count ++;
              }
            }
          }

          //var svg = '<svg width="828" height="128" class="js-calendar-graph-svg">'
          var svg = '<svg width="928" height="158" class="js-calendar-graph-svg">'

            //. css
            + '<defs>'
            + '<style>'
            + '.target-date{ stroke: #f00; }'
            + '.bgc-level-0{ fill: #ebedf0; }'
            + '.bgc-level-1{ fill: #9be9a8; }'
            + '.bgc-level-2{ fill: #40c463; }'
            + '.bgc-level-3{ fill: #30a14e; }'
            + '.bgc-level-4{ fill: #216e39; }'
            + '.ContributionCalendar-label{ font-size: 9px; }'
            + '</style>'
            + '</defs>'

            + '<g transform="translate(10,20)">';

          for( var i = 0; i < counts.length; i ++ ){
            if( i % 7 == 0 ){
              svg += '<g transform="translate(' + ( 16 * ( i / 7 ) ) + ',0)">';
            }

            var comments = counts[i].comments.join( ',' );
            svg += '<rect data-label="' + comments + '" width="11" height="11" x="16" y="' + ( ( i % 7 ) * 15 ) + '" class="ContributionCalendar-day ' + ( ( target_date && counts[i].ymd == target_date ) ? 'target-date ' : '' ) + 'bgc-level-' + ( counts[i].count > 4 ? 4 : counts[i].count ) + '" rx="2" ry="2" data-count="' + counts[i].count + '" data-date="' + counts[i].ymd + '" data-level="' + ( counts[i].count > 4 ? 4 : counts[i].count ) + '"></rect>';

            if( i % 7 == 6 ){
              svg += '</g>';
            }
          }

          if( counts.length % 7 > 0 ){
            svg += '</g>';
          }

          //. axis(month)
          var month_labels = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
          for( var i = 0; i < counts.length; i += 7 ){
            if( i == 0 && counts[i].date < 8 ){
              var x = 16;
              var text = '<text x="' + x + '" y ="-8" class="ContributionCalendar-label">' + month_labels[counts[i].month] + '</text>';
              svg += text;
            }else if( counts[i-7].month != counts[i].month ){
              var x = 16 + ( i / 7 ) * 16;
              var text = '<text x="' + x + '" y ="-8" class="ContributionCalendar-label">' + month_labels[counts[i].month] + '</text>';
              svg += text;
            }
          }

          //. axis(weekday)
          var weekday_labels = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];
          for( var i = 0; i < 7; i ++ ){
            //var dy = ( i % 2 ? ( Math.floor( i / 2 ) * 31 ) - 6 : 0 );
            var dy = ( i * 15 ) + 11;
            var text = '<text text-anchor="start" class="ContributionCalendar-label" dx="-10" dy="' + dy + '"';
            if( i % 2 == 0 ){
              text += ' style="display: none;"';
            }
            text += '>' + weekday_labels[i] + '</text>';
            svg += text;
          }

          //. XXX contributions in the last year
          svg += '<text class="ContributionCalendar-label" x="20" y="136">' + docs.length + ' contribution' + ( docs.length > 1 ? 's' : '' ) + ' in the last year</text>';

          //. Less - More
          svg += '<text class="ContributionCalendar-label" x="700" y="136">Less</text>';
          for( var i = 0; i < 5; i ++ ){
            svg += '<rect width="11" height="11" x="' + ( 730 + i * 15 ) + '" y="128" class="ContributionCalendar-day bgc-level-' + i + '" rx="2" ry="2" data-level="' + i + '"></rect>';
          }
          svg += '<text class="ContributionCalendar-label" x="810" y="136">More</text>';

          svg += '</g></svg>';

          res.contentType( 'image/svg+xml' );
          res.write( svg );
          res.end();
        }else{
          var result = { status: true };
          res.write( JSON.stringify( result ) );
          res.end();
        }
      }
    });
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'db not ready.' } ) );
    res.end();
  }
});

app.post( '/commit', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  if( db ){
    var uuid = req.headers['x-uuid'];
    var ts = ( new Date() ).getTime();
    if( req.body && req.body.timestamp ){
      ts = req.body.timestamp;
      if( typeof ts == 'string' ){
        try{
          ts = parseInt( ts );
        }catch( e ){
        }
      }
    }

    if( ts && uuid ){
      var doc = { timestamp: ts, uuid: uuid, comment: "" };
      if( req.body && req.body.comment ){
        doc.comment = req.body.comment;
      }
      db.insert( doc, function( err, body ){
        if( err ){
          res.status( 400 );
          res.write( JSON.stringify( { status: false, message: err } ) );
          res.end();
        }else{
          res.write( JSON.stringify( { status: true, doc: body } ) );
          res.end();
        }
      });
    }else{
      res.status( 400 );
      res.write( JSON.stringify( { status: false, error: 'wrong timestamp: ' + req.body.timestamp + ', or wrong uuid: ' + uuid } ) );
      res.end();
    }
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'db not ready.' } ) );
    res.end();
  }
});

app.delete( '/commit/:id', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  var id = req.params.id;
  if( db ){
    db.get( id, { include_docs: true }, function( err, data ){
      if( err ){
        res.status( 400 );
        res.write( JSON.stringify( { status: false, message: err } ) );
        res.end();
      }else{
        var uuid = req.headers['x-uuid'];
        if( uuid && data.uuid == uuid ){
          db.destroy( id, data._rev, function( err, body ){
            if( err ){
              res.status( 400 );
              res.write( JSON.stringify( { status: false, message: err } ) );
              res.end();
            }else{
              res.write( JSON.stringify( { status: true } ) );
              res.end();
            }
          });
        }else{
          res.status( 400 );
          res.write( JSON.stringify( { status: false, message: 'not owner' } ) );
          res.end();
        }
      }
    });
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'db not ready.' } ) );
    res.end();
  }
});

app.delete( '/commits', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  if( db ){
    var uuid = req.headers['x-uuid'];
    db.find( { selector: { uuid: { "$eq": uuid } }, fields: [ "_id", "_rev" ] }, function( err, result ){
      if( err ){
        res.status( 400 );
        res.write( JSON.stringify( { status: false, message: err } ) );
        res.end();
      }else{
        var docs = [];
        result.docs.forEach( function( doc ){
          doc._deleted = true;
          docs.push( doc );
        });
  
        db.bulk( { docs: docs }, function( err, body ){
          if( err ){
            res.status( 400 );
            res.write( JSON.stringify( { status: false, message: err } ) );
            res.end();
          }else{
            res.write( JSON.stringify( { status: true } ) );
            res.end();
          }
        });
      }
    });
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'db not ready.' } ) );
    res.end();
  }
});

app.post( '/setcookie', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var value = req.body.value;
  res.setHeader( 'Set-Cookie', value );

  res.write( JSON.stringify( { status: true }, 2, null ) );
  res.end();
});


function timestamp2obj( ts ){
  if( !ts ){ ts = 0; }

  var dt = new Date();
  dt.setTime( ts );
  
  var y = dt.getFullYear();
  var m = dt.getMonth() + 1;
  var d = dt.getDate();
  var w = dt.getDay();  //. Sun:0-6:Sat
  var ymd = y
    + '-' + ( m < 10 ? '0' : '' ) + m
    + '-' + ( d < 10 ? '0' : '' ) + d;

  var obj = {
    ymd: ymd,
    y: y,
    m: m,
    d: d,
    day: w,
    ts: ts
  };

  return obj;
}

function isLeapYear( y ){
  return ( y % 4 == 0 && ( y % 100 > 0 || y % 400 == 0 ) )
}

function compareByTimestamp( a, b ){
  var r = 0;
  if( a.timestamp < b.timestamp ){
    r = -1;
  }else if( a.timestamp > b.timestamp ){
    r = 1;
  }

  return r;
}


var port = process.env.PORT || 8080;
app.listen( port );
console.log( "server starting on " + port + " ..." );
