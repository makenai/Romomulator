$(document).ready(function() {


  Romo.control('#romo');

  var startX = Romo.x,
      startY = Romo.y,
      runningX = startX,
      runningY = startY,
      runningA = 0,
      scale  = 4,
      resolution = 5;
      
  var ctx = $('#field')[0].getContext('2d');
  ctx.strokeStyle = "rgb(200,0,0)";
  ctx.beginPath();
  ctx.moveTo( Romo.x, Romo.y );

  var paths = $('svg path');
  
  $(paths).each(function(i,path) {
    var length = path.getTotalLength();
    var c = 0;
    for ( i = 0; i < length; i += resolution ) {
      
      var point = path.getPointAtLength( i );
      
      var x = ( point.x * scale ) + startX,
          y = ( point.y * scale ) + startY,
          a = Math.atan2( y - runningY, x - runningX ) * ( 180 / Math.PI ) + 90,
          d = Math.sqrt( Math.pow( x - runningX, 2 ) + Math.pow( y - runningY, 2 ) );
                          
        ctx.lineTo( ( point.x * scale ) + startX, ( point.y * scale ) + startY );

        console.log( runningX + ', ' + runningY + ' to ' + x + ', ' + y + ' is ' + a + ' degrees and ' + d + ' distance' );
        Romo.rotate( ( a - runningA ) % 360 );
        Romo.move( d );
        
        runningX = x,
          runningY = y,
          runningA = a;                  
    };
  });
  
  ctx.stroke();
  
  // Back where we started from!
  
});