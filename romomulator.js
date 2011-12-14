var Romo = {

  // =========
  // Constants
  // =========

  TICK: 100,          // update every TICK milliseconds
  SPEED: 30,          // cm per second
  ROTATION_SPEED: 5, // degrees per second

  // ==================
  // Instance Variables
  // ==================
  
  x: 250,
  y: 250,
  end_x: 0,
  end_y: 0,

  rotation: 0,
  end_rotation: 0,

  queue: [],
  current_task: null,
    
  // Takes control of a DOM object as the romo
  control: function( romo_selector ) {
    this.romo = $(romo_selector);
    this.rotate_step( this.rotation );
    this.move_step( this.x, this.y );
    this.updatePosition();
  },
   
  rotate: function( degrees ) {
    this.queue.push({ rotate: degrees });
  },
  
  move: function( distance ) {
    this.queue.push({ move: distance });
  },
  
  taskComplete: function() {
    this.current_task = null;    
  },
  
  updatePosition: function() {

    // Get a task if we don't have one
    if ( this.current_task == null ) {
      if ( this.current_task = this.queue.shift() ) {
        // Cumulate rotation
        if ( this.current_task.rotate ) {
          this.end_rotation = this.rotation + this.current_task.rotate;
        }
        // Set destination
        if ( this.current_task.move ) {
          this.end_x = Math.round( this.x + this.current_task.move * Math.sin( this.rotation / 180 * Math.PI ) );
          this.end_y = Math.round( this.y - this.current_task.move * Math.cos( this.rotation / 180 * Math.PI ) );
          console.log('Move from: ' + this.x + ', ' + this.y + ' to ' + this.end_x + ', ' + this.end_y );
        }
      }
    }

    // Rotation
    if ( this.current_task && this.current_task.rotate ) {
      if ( this.rotation < this.end_rotation ) {
        this.rotation += this.ROTATION_SPEED;
        if ( this.rotation >= this.end_rotation ) {
          this.rotation = this.end_rotation;
          this.taskComplete();
        }
      }
      if ( this.rotation > this.end_rotation ) {
        this.rotation -= this.ROTATION_SPEED;
        if ( this.rotation <= this.end_rotation ) {
          this.rotation = this.end_rotation;
          this.taskComplete();
        }
      }      
      this.rotation = this.rotation % 360;
      this.rotate_step( this.rotation );
    }
    
    // Movement
    if ( this.current_task && this.current_task.move ) {
      var moved = false;
          
      var x_distance = this.end_x - this.x,
          y_distance = this.end_y - this.y;
          
      var moveBy = this.SPEED * ( this.TICK / 1000 ),
        moveX = Math.round( moveBy * Math.sin( this.rotation / 180 * Math.PI ) ),
        moveY = Math.round( moveBy * Math.cos( this.rotation / 180 * Math.PI ) );

      if ( Math.abs( x_distance ) > 0 ) {
        if ( x_distance > 0 ) {
          this.x += moveX;  
          if ( this.x > this.end_x ) {
            this.x = this.end_x;
          }
          moved = true;
        } else if ( x_distance < 0 ) {
          this.x -= moveX;
          if ( this.x < this.end_x ) {
            this.x = this.end_x;
          }          
          moved = true;
        }
      }

      if ( Math.abs( y_distance ) > 0 ) {
        if ( y_distance > 0 ) {
          this.y += moveY;
          if ( this.y > this.end_y ) {
            this.y = this.end_y;
          }
          moved = true;
        } else if ( y_distance < 0 ) {
          this.y -= moveY;
          if ( this.y < this.end_y ) {
            this.y = this.end_y;
          }
          moved = true;
        }
      }

      // Move checked
      if ( !moved ) {
        console.log('Move complete');
        this.taskComplete();        
      } else {
        this.move_step( this.x, this.y );
      }

    }

    // Always be updating
    setTimeout( function() { Romo.updatePosition() }, Romo.TICK );
  },
  
  rotate_step: function( degrees ) {
    this.romo.css( '-webkit-transform', 'rotate(' + degrees + 'deg)' );
    this.romo.css( '-moz-transform', 'rotate(' + degrees + 'deg)' );
    this.romo.css( '-o-transform', 'rotate(' + degrees + 'deg)' );
  },
  
  move_step: function( x, y ) {
    this.romo.css( 'left', (x - 50) + 'px' );    
    this.romo.css( 'top',  (y - 50) + 'px' );
  }
  
};

$(document).ready(function() {
  
  Romo.control( '#romo' );

  Romo.rotate( 30 );
  Romo.move( 50 );

    
/*  Romo.rotate( 45 );
  Romo.move( 50 );

  Romo.rotate( 90 );
  Romo.move( 50 );

  Romo.rotate( 90 );
  Romo.move( 50 );

  Romo.rotate( 90 );
  Romo.move( 50 );
  
  Romo.rotate( 45 );*/

  // Back where we started from!
  
});