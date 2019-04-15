//Creating a function called "ai" with input, x1, x2, y,w, h and fallOff ,giving when first called 
function ai(x1, x2, y, w, h, fallOff, canJump){
    //Creating local values.
    //Making sure that the x1 is the smallest of coordinates giving that are used to patrol between, x1 and x2.
    if(x1 < x2){
    this.x1 = x1;
    this.x2 = x2;
    } else if(x1 > x2){
    this.x1 = x2;
    this.x2 = x1;          
    }
    
    //Making a local fallOff that are either 1 or 2. 
    this.fallOff = fallOff;
    
    this.canJump = canJump;
    
    //Stating the local values giving at the start of each "ai".
    this.x = x1;
    this.y = y;
    this.w = w;
    this.h = h;

    this.RestartX = x1;
    this.RestartY = y;
    
    //Creating the values that are later used for movement.
    this.xDir = 0;
    this.Gravity = 0.2;
    this.g = 0;
    this.xSpeed = 1.75;
    this.d = 1;
    this.canMove = false;
    this.oldxDir = 0;
    this.left = 0;
    this.right = 0;
    this.way = 0;
    
    //Creating values for the target which will be the player.
    this.xTarget = 0;
    this.wTarget = 0;
    this.newXTarget = 0;
    
    //A value that are affected in "main.js" and are used to know if the local "ai" can see the player.
    this.isInRange = false;
    
    //Values used to create a field of view.
    this.xSee;
    this.ySee;
    this.wSee = 150;
    this.hSee;
    
    //Creating values that are affected in "main.js" and are used to determin if the local "ai" can keep moving in a giving direction.
    this.dontFallleft = false;
    this.dontFallright = false;
    this.dontMoveleft = false;
    this.dontMoveright = false;
    
    //Setting up a local clock.
    this.Timer = 0;
    
    //Creating a local timer to help the "ai" move on after some time, after losing sight of the player.
    this.seeTimer = 0;
    
    //Turns true if the "Player" attacks.
    this.AttackedByPlayer = false;
    
    this.jumpHeight = 6;
    this.jumpSpeed = 0;
    this.g = 0;
    
    this.delayTimer = 0;
    this.delayed = true;
    
    this.currentState = "Patroling";

	this.readyToJump = 0;

    //Creating a local function called "draw" and will contain the visual code.
    this.draw = function(){
        
        //Setting the color of the main parts of "ai".
        fill(255,0,0);
        //Making the main part of the "ai" body.
        rect(this.x, this.y, this.w, this.h);
        
        //Creating an if statement to determin which way the "ai" should look.
        if(this.oldxDir == 1){
            
            //Making the nose apear on the right side.
            rect(this.x + this.w, this.y + this.h/2, 4,4);
            
            //Creating the eye with the color of black.
            fill(0);
            rect(this.x + this.w - 15, this.y + 10, 10, 10);
        } else if(this.oldxDir == -1){
            
            //Making the nose apear on the left side.
            rect(this.x - 4, this.y + this.h/2, 4,4);
            
            //Creating the eye with the color of black.
            fill(0);
            rect(this.x + 5, this.y + 10, 10, 10);
        } else if(this.oldxDir == 0){
            
            rect(this.x + (this.w/2) - 2, this.y + this.h/2, 4,4);
            
            //Creating the eye with the color of black.
            fill(0);
            rect(this.x + this.w - 15, this.y + 10, 10, 10);            
            rect(this.x + 5, this.y + 10, 10, 10);            
        }

        
        //Stating values to be used in "main.js".
        this.xSee = this.x + (this.w/2) - this.wSee/2;
        this.ySee = this.y + 1;
        this.hSee = this.h - 1;
    }
}