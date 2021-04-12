//. message.js
var api = {};

api.process = function( message, uuid ){
  if( message ){
    var asciicodes = [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [ [] ], //. HT
      [], //. LF
      [],
      [],
      [], //. CR
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [ [] ], //. SPACE
      [ [ 0, 1, 2, 3, 4, 6 ] ], //. !
      [ [ 0, 1 ], [], [ 0, 1 ] ], //. "
      [ [ 1, 5 ], [ 0, 1, 2, 3, 4, 5, 6 ], [ 1, 5 ], [ 0, 1, 2, 3, 4, 5, 6 ], [ 1, 5 ] ], //. #
      [ [ 1, 2, 3, 5 ], [ 1, 3, 5 ], [ 0, 1, 2, 3, 4, 5, 6 ], [ 1, 3, 5 ], [ 1, 3, 4, 5 ] ], //. $
      [ [ 0, 1, 5, 6 ], [ 0, 1, 4 ], [ 3 ], [ 2, 5, 6 ], [ 0, 1, 5, 6 ]], //. %
      [ [ 1, 2, 4, 5 ], [ 0, 3, 6 ], [ 0, 3, 6 ], [ 1, 2, 4, 5 ], [ 2, 6 ] ], //. &
      [ [ 0, 1 ]], //. '
      [ [ 2, 3, 4 ], [ 0, 1, 5, 6 ]], //. (
      [ [ 0, 1, 5, 6 ], [ 2, 3, 4 ]], //. )
      [ [ 2, 4 ], [ 3 ], [ 2, 3, 4 ], [ 3 ], [ 2, 4 ] ], //. *
      [ [ 3 ], [ 3 ], [ 1, 2, 3, 4, 5 ], [ 3 ], [ 3 ] ], //. +
      [ [ 6 ], [ 5 ] ], //. ,
      [ [ 3 ], [ 3 ], [ 3 ] ], //. -
      [ [ 6 ] ], //. .
      [ [ 5, 6 ], [ 4 ], [ 3 ], [ 2 ], [ 0, 1 ] ], //. /
      [ [ 1, 2, 3, 4, 5 ], [ 0, 4, 6 ], [ 0, 3, 6 ], [ 0, 2, 6 ], [ 1, 2, 3, 4, 5 ]], //. 0
      [ [ 1, 6 ], [ 0, 1, 2, 3, 4, 5, 6 ], [ 6 ] ], //. 1
      [ [ 1, 5, 6 ], [ 0, 4, 6 ], [ 0, 3, 6 ], [ 0, 3, 6 ], [ 1, 2, 6 ] ], //. 2
      [ [ 1, 3, 5 ], [ 0, 3, 6 ], [ 0, 3, 6 ], [ 0, 3, 6 ], [ 1, 2, 4, 5 ] ], //. 3
      [ [ 3, 4 ], [ 2, 4 ], [ 1, 4 ], [ 0, 1, 2, 3, 4, 5, 6 ], [ 4 ] ], //. 4
      [ [ 0, 1, 2, 3, 6 ], [ 0, 3, 6 ], [ 0, 3, 6 ], [ 0, 3, 6 ], [ 0, 4, 5 ] ], //. 5
      [ [ 1, 2, 3, 4, 5 ], [ 0, 3, 6 ], [ 0, 3, 6 ], [ 0, 3, 6 ], [ 0, 4, 5 ] ], //. 6
      [ [ 0 ], [ 0 ], [ 0, 5, 6 ], [ 0, 3, 4 ], [ 0, 1, 2 ] ], //. 7
      [ [ 1, 2, 4, 5 ], [ 0, 3, 6 ], [ 0, 3, 6 ], [ 0, 3, 6 ], [ 1, 2, 4, 5 ] ], //. 8
      [ [ 1, 2, 5 ], [ 0, 3, 6 ], [ 0, 3, 6 ], [ 0, 3, 6 ], [ 1, 2, 3, 4, 5 ]], //. 9
      [ [ 2, 4 ] ], //. :
      [ [ 5 ], [ 2, 4 ] ], //. ;
      [ [ 3 ], [ 2, 4 ], [ 1, 5 ], [ 0, 6 ] ], //. <
      [ [ 2, 4 ], [ 2, 4 ], [ 2, 4 ] ], //. =
      [ [ 0, 6 ], [ 1, 5 ], [ 2, 4 ], [ 3 ] ], //. >
      [ [ 1 ], [ 0 ], [ 0, 3, 4, 6 ], [ 0, 3 ], [ 1, 2 ] ], //. ?
      [ [ 1, 2, 3, 4, 5 ], [ 0, 6 ], [ 0, 3, 4, 5, 6 ], [ 0, 3, 6 ], [ 1, 2, 3, 4 ] ], //. @
      [ [ 5, 6 ], [ 2, 3, 4 ], [ 0, 1, 4 ], [ 2, 3, 4 ], [ 5, 6 ] ], //. A
      [ [ 0, 1, 2, 3, 4, 5, 6 ], [ 0, 3, 6 ], [ 0, 3, 6 ], [ 0, 3, 6 ], [ 1, 2, 4, 5 ] ], //. B
      [ [ 1, 2, 3, 4, 5 ], [ 0, 6 ], [ 0, 6 ], [ 0, 6 ], [ 1, 5 ] ], //. C
      [ [ 0, 1, 2, 3, 4, 5, 6 ], [ 0, 6 ], [ 0, 6 ], [ 1, 5 ], [ 2, 3, 4 ]], //. D
      [ [ 0, 1, 2, 3, 4, 5, 6 ], [ 0, 3, 6 ], [ 0, 3, 6 ], [ 0, 3, 6 ], [ 0, 3, 6 ] ], //. E
      [ [ 0, 1, 2, 3, 4, 5, 6 ], [ 0, 3 ], [ 0, 3 ], [ 0, 3 ], [ 0, 3 ] ], //. F
      [ [ 1, 2, 3, 4, 5 ], [ 0, 6 ], [ 0, 6 ], [ 0, 4, 6 ], [ 0, 4, 5, 6 ], ], //. G
      [ [ 0, 1, 2, 3, 4, 5, 6 ], [ 3 ], [ 3 ], [ 3 ], [ 0, 1, 2, 3, 4, 5, 6 ] ], //. H
      [ [ 0, 6 ], [ 0, 1, 2, 3, 4, 5, 6 ], [ 0, 6 ] ], //. I
      [ [ 0, 6 ], [ 0, 6 ], [ 0, 1, 2, 3, 4, 5 ], [ 0 ] ], //. J
      [ [ 0, 1, 2, 3, 4, 5, 6 ], [ 3 ], [ 2, 4 ], [ 1, 5 ], [ 0, 6 ] ], //. K
      [ [ 0, 1, 2, 3, 4, 5, 6 ], [ 6 ], [ 6 ] ], //. L
      [ [ 0, 1, 2, 3, 4, 5, 6 ], [ 1 ], [ 2, 3 ], [ 1 ], [ 0, 1, 2, 3, 4, 5, 6 ] ], //. M
      [ [ 0, 1, 2, 3, 4, 5, 6 ], [ 1, 2 ], [ 3 ], [ 4, 5 ], [ 0, 1, 2, 3, 4, 5, 6 ] ], //. N
      [ [ 1, 2, 3, 4, 5 ], [ 0, 6 ], [ 0, 6 ], [ 0, 6 ], [ 1, 2, 3, 4, 5 ] ], //. O
      [ [ 0, 1, 2, 3, 4, 5, 6 ], [ 0, 3 ], [ 0, 3 ], [ 0, 3 ], [ 1, 2 ] ], //. P
      [ [ 1, 2, 3 ], [ 0, 4 ], [ 0, 4, 5, 6 ], [ 0, 4, 6 ], [ 1, 2, 3, 6 ], ], //. Q
      [ [ 0, 1, 2, 3, 4, 5, 6 ], [ 0, 3 ], [ 0, 3, 4 ], [ 0, 3, 5 ], [ 1, 2, 6 ] ], //. R
      [ [ 1, 2, 6 ], [ 0, 3, 6 ], [ 0, 3, 6 ], [ 0, 3, 6 ], [ 0, 4, 5 ] ], //. S
      [ [ 0 ], [ 0 ], [ 0, 1, 2, 3, 4, 5, 6 ], [ 0 ], [ 0 ] ], //. T
      [ [ 0, 1, 2, 3, 4, 5 ], [ 6 ], [ 6 ], [ 6 ], [ 0, 1, 2, 3, 4, 5 ] ], //. U
      [ [ 0, 1 ], [ 2, 3, 4 ], [ 5, 6 ], [ 2, 3, 4 ], [ 0, 1 ] ], //. V
      [ [ 0, 1, 2, 3, 4, 5, 6 ], [ 5 ], [ 3, 4 ], [ 5 ], [ 0, 1, 2, 3, 4, 5, 6 ] ], //. W
      [ [ 0, 6 ], [ 1, 2, 4, 5 ], [ 3 ], [ 1, 2, 4, 5 ], [ 0, 6 ] ], //. X
      [ [ 0 ], [ 1, 2 ], [ 3, 4, 5, 6 ], [ 1, 2 ], [ 0 ] ], //. Y
      [ [ 0, 5, 6 ], [ 0, 4, 6 ], [ 0, 3, 6 ], [ 0, 2, 6 ], [ 0, 1, 6 ] ], //. Z
      [ [ 0, 1, 2, 3, 4, 5, 6 ], [ 0, 6 ] ], //. [
      [ [ 0 ], [ 1, 2 ], [ 3 ], [ 4, 5 ], [ 6 ] ], //. \
      [ [ 0, 6 ], [ 0, 1, 2, 3, 4, 5, 6 ] ], //. ]
      [ [ 1 ], [ 0 ], [ 1 ] ], //. ^
      [ [ 6 ], [ 6 ], [ 6 ] ], //. _
      [ [ 0 ], [ 1 ] ], //. `
      [ [ 4, 5 ], [ 3, 6 ], [ 3, 6 ], [ 2, 3, 4, 5, 6 ] ], //. a
      [ [ 0, 1, 2, 3, 4, 5, 6 ], [ 2, 6 ], [ 2, 6 ], [ 3, 4, 5 ] ], //. b
      [ [ 3, 4, 5 ], [ 2, 6 ], [ 2, 6 ] ], //. c
      [ [ 3, 4, 5 ], [ 2, 6 ], [ 2, 6 ], [ 0, 1, 2, 3, 4, 5, 6 ] ], //. d
      [ [ 3, 4, 5 ], [ 2, 4, 6 ], [ 2, 4, 6 ], [ 3, 4 ] ], //. e
      [ [ 3 ], [ 1, 2, 3, 4, 5, 6 ], [ 0, 3 ] ], //. f
      [ [ 3 ], [ 2, 4, 6 ], [ 2, 4, 6 ], [ 3, 4, 5 ] ], //. g
      [ [ 0, 1, 2, 3, 4, 5, 6 ], [ 3 ], [ 3 ], [ 4, 5, 6 ] ], //. h
      [ [ 1, 3, 4, 5, 6 ] ], //. i
      [ [ 6 ], [ 1, 3, 4, 5 ] ], //. j
      [ [ 0, 1, 2, 3, 4, 5, 6 ], [ 4 ], [ 3, 5 ], [ 2, 6 ] ], //. k
      [ [ 0, 1, 2, 3, 4, 5, 6 ] ], //. l
      [ [ 4, 5, 6 ], [ 2, 3 ], [ 4, 5, 6 ], [ 2, 3 ], [ 4, 5, 6 ] ], //. m
      [ [ 2, 3, 4, 5, 6 ], [ 3 ], [ 3 ], [ 4, 5, 6 ] ], //. n
      [ [ 3, 4, 5 ], [ 2, 6 ], [ 2, 6 ], [ 3, 4, 5 ] ], //. o
      [ [ 2, 3, 4, 5, 6 ], [ 2, 5 ], [ 2, 5 ], [ 3, 4 ] ], //. p
      [ [ 3, 4 ], [ 2, 5 ], [ 2, 5 ], [ 2, 3, 4, 5, 6 ] ], //. q
      [ [ 2, 3, 4, 5, 6 ], [ 3 ], [ 2 ], [ 2 ] ], //. r
      [ [ 3, 6 ], [ 2, 4, 6 ], [ 2, 4, 6 ], [ 2, 5 ] ], //. s
      [ [ 3 ], [ 2, 3, 4, 5 ], [ 3, 6 ] ], //. t
      [ [ 2, 3, 4, 5 ], [ 6 ], [ 6 ], [ 2, 3, 4, 5, 6 ] ], //. u
      [ [ 2, 3, 4 ], [ 5, 6 ], [ 2, 3, 4 ] ], //. v
      [ [ 2, 3, 4 ], [ 5, 6 ], [ 2, 3, 4 ], [ 5, 6 ], [ 2, 3, 4 ] ], //. w
      [ [ 2, 3, 5, 6 ], [ 4 ], [ 2, 3, 5, 6 ] ], //. x
      [ [ 2, 6 ], [ 3, 5 ], [ 4 ], [ 2, 3 ] ], //. y
      [ [ 2, 5, 6 ], [ 2, 4, 6 ], [ 2, 4, 6 ], [ 2, 3, 6 ] ], //. z
      [ [ 3 ], [ 1, 2, 4, 5 ], [ 0, 6 ] ], //. {
      [ [ 0, 1, 2, 3, 4, 5, 6 ] ], //. |
      [ [ 0, 6 ], [ 1, 2, 4, 5 ], [ 3 ] ], //. }
      [ [ 1 ], [ 0 ], [ 1 ], [ 0 ], [ 1 ] ] //. ~
    ];

    var codes = [];
    for( var i = 0 ; i < message.length; i ++ ){
      var code = message.charCodeAt( i );
      if( code < asciicodes.length ){
        codes.push( code );
      }else{
        codes.push( -1 );
      }
    }

    var now_dt = new Date();
    var now_ts = now_dt.getTime();
    var year_ts = now_ts - ( 365 * 86400 * 1000 );
    var y = now_dt.getFullYear();
    var m = now_dt.getMonth() + 1;
    if( m < 3 ){
      y --;
    }
    if( y % 4 == 0 && ( y % 100 > 0 || y % 400 == 0 ) ){
      year_ts -= ( 86400 * 1000 );
    }
    var year_dt = new Date();
    year_dt.setTime( year_ts );

    //. １年前の日曜日のタイムスタンプ
    var d = year_dt.getDay();
    //if( d ){
      year_ts += ( ( 7 - d ) * 86400 * 1000 );
      year_dt.setTime( year_ts );
    //}

    //var doc = { timestamp: ts, uuid: uuid, comment: "" };
    var docs = [];
    var ts = year_ts;
    var b = true;
    for( var i = 0; i < codes.length && b; i ++ ){
      if( codes[i] > -1 && asciicodes[codes[i]].length > 0 ){
        if( docs.length > 0 ){
          ts += ( 7 * 86400 * 1000 );
          if( ts > now_ts ){
            b = false;
          }
        }

        var asciicode = asciicodes[codes[i]];
        for( var j = 0; j < asciicode.length && b; j ++ ){
          for( var k = 0; k < asciicode[j].length && b; k ++ ){
            var w = asciicode[j][k];
            var t = ( ts + w * 86400 * 1000 );
            if( t > now_ts ){
              b = false;
            }else{
              var doc = { timestamp: t, uuid: uuid, comment: '' };
              docs.push( doc );
            }
          }

          ts += ( 7 * 86400 * 1000 );
          if( ts > now_ts ){
            b = false;
          }
        }
      }
    }

    return docs;
  }else{
    return null;
  }
};

module.exports = api;