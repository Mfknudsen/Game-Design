//Creating a function called "controller" with giving values of x,y,w and h that are giving at the start of a new "controller". 
function controller(x,y,w,h){
    //Setting up values for the giving values.
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    
    this.RestartX = x;
    this.RestartY = y;
    
    //Creating a false or true value to help state if the "controller" can move.
    this.canMoveX = true;
    
    //Creating values for the direction.
    this.left = 0;
    this.right = 0;
    this.xDir = 0;
    
    //Setting up the speed for the "controller" on the x-axis.
    this.xSpeed = 4;
    
    //Setting up values for the use of movement on the y-axis.
    this.isGrounded = false;
    this.Gravity = 0.2;
    this.jumpSpeed = 0;
    this.jumpHeight = 6;
    this.jumpNow = false;
    
    //Setting up values for the "life" function.
    this.startHP = 5;
    this.endHP = this.startHP;
    this.Damage = 0;
    this.newDamage = 0;
    this.Timer = 0;
    this.timerEnd = 160;
    
    //Setting up a value for the eye.
    this.xHat = -10;
    this.d = 1;
    
    //Creating a local function called "show" that will contain the code for the visual of "controller".
    this.show = function(){
        //Setting some if statement to determin which way the "controller" is looking.
        if(this.xDir == -1){this.d = -1}
        if(this.xDir == 1){this.d = 1}
        if(this.d == 1){this.xHat = this.w - 15;}
        if(this.d == -1){this.xHat = +5}
        
        //Setting the color.
        fill(0,255,0);
        //Some more if statements for which way the "controller" is looking.
        if(this.d == 1){
            rect(this.x + this.w, this.y + this.h/2, 4,4);
        } else if(this.d == -1){
            rect(this.x - 4, this.y + this.h/2, 4,4);
        }
        //Drawing the "controller".
        rect(this.x, this.y, this.w, this.h);
        fill(255);
        rect(this.x + this.xHat, this.y +10, 10, 10);
    }
    
    //Creating a local function called "life" that will contain the code for the life and the how damage is inflicted on the "controller"
    this.life = function(){
        //Creating a timer, so that when the "controller" is damage, there will be a delay before it can happen again.
        if(this.Timer >= this.timerEnd){
            if(this.newDamage > 0){
           this.Damage += this.newDamage
           this.newDamage = 0;
            this.Timer = 0;
            }
        } else{
           this.newDamage = 0;
           this.Timer++
        }
        //Stating what the final health will be.
        this.endHP = this.startHP - this.Damage;
        
        //Creating the visual for the life bar.
        textSize(26);
        text("Life", 10, 10,400,400);
        textSize(15);
        
        fill(255,0,0);        
        noStroke();
        for(this.i = 0; this.i < this.endHP; this.i++){
           rect(60 + (30 * this.i), 10, 30,30); 
        }
        stroke(1);
    }
}