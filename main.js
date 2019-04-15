//Setting up the event listener for keyboard input.
window.addEventListener("keydown", checkKeyDown, false);
window.addEventListener("keyup", checkKeyUp, false);

//Display will hold the objects of the map.
var Display;

//Player will hold the code of which the player will directly interact with.
var Player;

//Enemies will hold the objects of the ais.
var Enemies = []

//Making two variables to use in later functions.
var g = 0;
var wh = 2;

//Creating a timer for optimization in the "Enemies".
var timerEnd = 5;

var LastX;

//Creating the "setup" function that is used at the start of the script.
function setup(){
    //Setting the canvas.
    createCanvas(800, 600);

    //Settubg up the "Player" and "Display" as objects. "Player" will also be giving some values of x, y, w and h.
    Display = new display();
    Player = new controller(-15, 100, 35, 45);
    
    //Calling the functions that are needed to run ones at the start of the game.
    Display.Start();
    spawnEnemies();
}

//Creating the "draw" function that will be called every frame.
function draw(){
    //Setting the color of the background.
    background(0,0,50);
    
    //Calling the function that need to update every frame.
    Display.draw();
    enemyUpdate();
    playerUpdate();
}

//Creating a function called "playerUpdate" that will contain all the function and some single code that make the "Player" work. 
function playerUpdate(){
    if(Player.endHP == 0){
        RestartPlayer();
    }
    //Stating the direction of the "Player".
    Player.xDir = Player.left + Player.right;
    
    //Calling some local function inside of the "Player" object.
    Player.show();
    Player.life();
    
    //Calling the function "movePlayer".
    movePlayer();
}

//Creating a function called "enemyUpdate" that will contain all the function and some single code that make the "Enemies" work. 
function enemyUpdate(){
    if(Player.endHP != 0){
    //Making a for each statement that will run the code for all of the "Enemies".
    for(var i = 0 ; i < Enemies.length; i++){
        
        enemyChangeState(i);
        enemyState(i);
        
        if(Enemies[i].AttackedByPlayer == false){
        
            enemyDelay(i);
            
            damagePlayer(i);
            seePlayer(i);
        
                        
            Enemies[i].draw();
        
            //Checking if the "Player" is within range and if it is, then it will follow else it will patrol.
            if(Enemies[i].isInRange == false){
                //enemyPatrol(i);
                Enemies[i].Timer = 0;
            } else{
                if(Enemies[i].Timer == timerEnd){
                    Enemies[i].xTarget = Player.x;
                    Enemies[i].Timer = 0;
                }
            
                if(Enemies[i].Timer < timerEnd){
                    Enemies[i].Timer++
                }
                Enemies[i].wTarget = Player.w;
                //enemyFollowPlayer(i);
            }
        }
    }
    } else{
        for(var e = 0 ; e < Enemies.length; e++){
        RestartEnemies(e);
        }
    }
}

//Calling two function using the eventlistiner in the start of the script, to get the keyboard input.
function checkKeyDown(key){
    if(key.keyCode == "65"){Player.left = -1}
    if(key.keyCode == "68"){Player.right = 1}
    
    if(key.keyCode == "32"){Player.jumpNow = true}
}
function checkKeyUp(key){
    if(key.keyCode == "65"){Player.left = 0}
    if(key.keyCode == "68"){Player.right = 0}

    if(key.keyCode == "32"){Player.jumpNow = false}
}

//Creating a function called "spawnEnemies" that will contain all of the push functions used to create more of the "ai" objects.
function spawnEnemies(){
    //The "ai" objects will be giving values of x1, x2, y, w, h, fallOff and canJump.
    Enemies.push(new ai(50, 750, 150, 35, 45, false, true));
    //Enemies.push(new ai(450, 700, 150, 35, 45, false, true));
    //Enemies.push(new ai(200, 465, 150, 35, 45, false, true));
}

var enemyState = function(i){
 
    console.log();
    
    if(Enemies[i].currentState == "Patroling"){
       
	   enemyReadyingToJump(i);

	   if(enemyCheckGround(i) == false){
           
           enemyPatrol(i);
           
           enemyDelay(i);
           
           if(Enemies[i].delayed){
               enemyMove(i);
           }
           
           if(Enemies[i].canJump == true && Enemies[i].jumpSpeed <= 0 && Enemies[i].readyToJump == 2){

               enemyJumpLeft(i);
               enemyJumpRight(i);
         
           }
           
           if(Enemies[i].fallOff == false){
               
               enemyDontFallLeft(i);
               enemyDontFallRight(i);
           
           }
           
       enemyDontMoveLeft(i);
       enemyDontMoveRight(i);
       
       }
       if(Enemies[i].jumpSpeed <= 0){
           
           enemyFall(i);
       
       } else if(Enemies[i].jumpSpeed > 0){
           
           enemyJump(i);
       
       }
        
    } else if(Enemies[i].currentState == "Following"){
       
       enemyFollowPlayer(i);
    
    }    
}

var enemyChangeState = function(i){
    
    if(Enemies[i].isInRange == false){
       
        Enemies[i].currentState = "Patroling";
        
    } else if(Enemies[i].isInRange == true){
       
        Enemies[i].currentState = "Following";
        
    }   
}

var enemyCheckGround = function(i){
    if(enemyPlaceFree(Enemies[i].x + 1, Enemies[i].y + Enemies[i].h,Enemies[i].w - 2, 3)){
       return true;
    } else {
       return false;
    }
}

var enemyMove = function(i){
    Enemies[i].xDir = Enemies[i].right - Enemies[i].left;
    for (var s = Enemies[i].xSpeed; s > 0; s--){
        if(placeFree(Enemies[i].x + s * Enemies[i].xDir, Enemies[i].y) == true && Enemies[i].delayed){
            Enemies[i].x += s * Enemies[i].xDir;
            Enemies[i].oldxDir = Enemies[i].xDir;
            break;
        }
    }    
}

var enemyDelay = function(i){
    if(Enemies[i].delayed == false){
        if(Enemies[i].delayTimer >= 60){
            Enemies[i].delayed = true;
            Enemies[i].delayTimer = 0;
        } else{
            Enemies[i].delayTimer += 1;
        }
    }
}

var enemyPatrol = function(i){
    
    if(Enemies[i].x == Enemies[i].x1 && Enemies[i].xDir == 0){
       Enemies[i].right = 1;
       Enemies[i].left = 0;
       Enemies[i].delayed = false;
       
    } else if(Enemies[i].dontMoveleft){
       console.log("check");
       Enemies[i].right = 1;
       Enemies[i].left = 0;
       Enemies[i].delayed = false;
    
    } else if(Enemies[i].dontMoveright){
        
       Enemies[i].right = 0;
       Enemies[i].left = 1;
       Enemies[i].delayed = false;
        
    } else if(Enemies[i].x <= Enemies[i].x1 && Enemies[i].xDir == -1){
        
       Enemies[i].right = 1;
       Enemies[i].left = 0;
       Enemies[i].delayed = false;
    
    } else if(Enemies[i].x + Enemies[i].w >= Enemies[i].x2 && Enemies[i].xDir == 1){
               
       Enemies[i].right = 0;
       Enemies[i].left = 1;
       Enemies[i].delayed = false;
    }
}

var enemyFollowPlayer = function(i){
    if(Enemies[i]){
       
       }
}

var enemyReadyingToJump = function(i){
	if(Enemies[i].readyToJump < 2 && enemyCheckGround(i) == false){
	    Enemies[i].readyToJump += 1;
	}
	
	if(enemyCheckGround(i)){
		Enemies[i].readyToJump = 0;
	}
}

//Creating a variable "enemyFall" as a function to mimic the effeckts of gravity on the "Enemies". 
var enemyFall = function(e){
   
    Enemies[e].jumpSpeed = 0;
    
    //Creating constant gravity that mimics real life gravity.
    Enemies[e].g += Enemies[e].Gravity
    
    for (var i = 0; i < Enemies[e].g; i += 0.01){
        
        if(enemyPlaceFree(Enemies[e].x, Enemies[e].y + Enemies[e].g - i, Enemies[e].w + 2, Enemies[e].h)){
            
            Enemies[e].y += Enemies[e].g - i;
            break;
        
        } else {
            
            Enemies[e].g = 0;
            Enemies[e].jumpSpeed = 0;
        
        }
    }
    
    if(enemyCheckGround(e)){
        
        for (var s = Enemies[e].xSpeed; s > 0; s--){
            
            if(placeFree(Enemies[e].x + s * Enemies[e].xDir, Enemies[e].y) == true){
                
                Enemies[e].x += s * Enemies[e].xDir;
                break;
            
            }
        }
    }
}

var enemyJump = function(i){
    for (var e = 0; e < (Enemies[i].jumpSpeed); e += 0.1){
        
        Enemies[i].g += Enemies[i].Gravity;
        
        if(Enemies[i].jumpSpeed - Enemies[i].g - e <= 0){
            
            Enemies[i].g = 0;
            Enemies[i].jumpSpeed = 0;
        
        }
        
        if(enemyPlaceFree(Enemies[i].x, Enemies[i].y - (Enemies[i].jumpSpeed - (Enemies[i].g - e)))){
            
            Enemies[i].y -= Enemies[i].jumpSpeed - Enemies[i].g - e;
            break;
        
        }
    }
    
    Enemies[i].xDir = Enemies[i].oldxDir;
    
    if(enemyCheckGround(i) && Enemies[i].jumpSpeed > 0){
        
        for (var s = Enemies[i].xSpeed; s > 0; s--){
            
            if(placeFree(Enemies[i].x + s * Enemies[i].xDir, Enemies[i].y) == true){
                
                Enemies[i].x += s * Enemies[i].xDir;
                break;
            
            }
        }    
    }
}

var enemyJumpLeft = function(i){
    //fill(255);
    //rect(Enemies[i].x - Enemies[i].w/2, Enemies[i].y - 1 - 25 * 3, 1.5 * Enemies[i].w, Enemies[i].h - 1);
    //rect(Enemies[i].x - 5, Enemies[i].y, Enemies[i].w, Enemies[i].h - 4);
        
    if (enemyPlaceFree(Enemies[i].x - 2, Enemies[i].y, 2, Enemies[i].h - 4) == false && enemyPlaceFree(Enemies[i].x - Enemies[i].w/2, Enemies[i].y - 1 - 25 * 3, 2 * Enemies[i].w, Enemies[i].h - 1) == true && Enemies[i].xDir == -1){
        Enemies[i].jumpSpeed = Enemies[i].jumpHeight;
    }
}
var enemyJumpRight = function(i){
    //fill(255);
    //rect(Enemies[i].x, Enemies[i].y - 1 - 25 * 3, 1.5 * Enemies[i].w, Enemies[i].h - 1);
    //rect(Enemies[i].x + Enemies[i].w, Enemies[i].y, 5, Enemies[i].h - 4);
        
    if (enemyPlaceFree(Enemies[i].x + Enemies[i].w, Enemies[i].y, 5, Enemies[i].h - 4) == false && enemyPlaceFree(Enemies[i].x, Enemies[i].y - 1 - 25 * 3, 1.5 *  Enemies[i].w, Enemies[i].h - 1) == true && Enemies[i].xDir == 1){
        Enemies[i].jumpSpeed = Enemies[i].jumpHeight;
    }
}

//Creating a variable "enemyDontMove" as a function for left and right that check if there is a "Block" in the way of the "Enemies".
var enemyDontMoveLeft = function(i){
    
    //fill(255);
    //rect(Enemies[i].x - 2, Enemies[i].y, Enemies[i].w, Enemies[i].h);
    //rect(Enemies[i].x - Enemies[i].w/2, Enemies[i].y - 1 - 25 * 3, 1.5 * Enemies[i].w, Enemies[i].h - 1);
    
    if(enemyPlaceFree(Enemies[i].x - 2, Enemies[i].y, Enemies[i].w, Enemies[i].h) == false && enemyPlaceFree(Enemies[i].x - Enemies[i].w/2, Enemies[i].y - 1 - 25 * 3, 1.5 * Enemies[i].w, Enemies[i].h) == false && Enemies[i].xDir == -1){
        Enemies[i].dontMoveleft = true;
        Enemies[i].delayed = false;
    } else{
        Enemies[i].dontMoveleft = false;
    }
}
var enemyDontMoveRight = function(i){
    
    //fill(255);
    //rect(Enemies[i].x + Enemies[i].w, Enemies[i].y, 5, Enemies[i].h - 4);
    //rect(Enemies[i].x, Enemies[i].y - 1 - 25 * 3, 1.5 *  Enemies[i].w, Enemies[i].h);
    
    if(enemyPlaceFree(Enemies[i].x + Enemies[i].w, Enemies[i].y, 5, Enemies[i].h - 4) == false && enemyPlaceFree(Enemies[i].x, Enemies[i].y - 1 - 25 * 3, 1.5 *  Enemies[i].w, Enemies[i].h) == false && Enemies[i].xDir == 1){
        Enemies[i].dontMoveright = true;
        Enemies[i].delayed = false;
    } else{
        Enemies[i].dontMoveright = false;
    }
}

//Creating a variable "enemyDontFall" as a function for left and right that check if there is a lag of a "Block" to walkt on.
var enemyDontFallLeft = function(i){
    
    //fill(255);
    //rect(Enemies[i].x - Enemies[i].w - 1, Enemies[i].y + Enemies[i].h + 1, Enemies[i].w, Enemies[i].h);
    
    if(enemyPlaceFree(Enemies[i].x - Enemies[i].w - 1, Enemies[i].y + Enemies[i].h + 1, Enemies[i].w, Enemies[i].h) == true){
        Enemies[i].dontFallleft = true;
        Enemies[i].dontFallright = false;    
    } else{
        Enemies[i].dontFallleft = false;
    }
}
var enemyDontFallRight = function(i){
    
    //fill(255);
    //rect(Enemies[i].x + Enemies[i].w + 1, Enemies[i].y + Enemies[i].h + 1, Enemies[i].w, Enemies[i].h);
    
    if(enemyPlaceFree(Enemies[i].x + Enemies[i].w + 1, Enemies[i].y + Enemies[i].h + 1, Enemies[i].w, Enemies[i].h) == true){
        Enemies[i].dontFallright = true;    
    } else{
        Enemies[i].dontFallright = false;
    }
}

//Creating a variable "enemyPlaceFree" as a function to determin if the "Enemies" can move to their new position.
var enemyPlaceFree = function(xNew,yNew,wNew,hNew){
    var tempObj = {x: xNew, y: yNew, w: wNew, h: hNew};
    
    for (var i = 0; i < Display.Blocks.length; i++){
        if(collisionDetect(tempObj, Display.Blocks[i]) == true){
            return false;
        } else {
            if(i == Display.Blocks.length - 1){
            return true;
            }
        }
    }
}

//Creating a variable "damagePlayer" as a function that will inflict damage on the "Player" if it colides with one of the "Enemies" by adding on the local varible of the "Player" called "newDamage".
var damagePlayer = function(i){
    if(collisionDetect(Player, Enemies[i]) && Enemies[i].AttackedByPlayer == false){
       Player.newDamage = 1;
       }
}

//Creating a variable "seePlayer" as a function that will determin if the "Player" is within range of the individual "Enemies".
var seePlayer = function(i){
    var tempView = {x: Enemies[i].xSee, y: Enemies[i].ySee, w: Enemies[i].wSee, h: Enemies[i].hSee}
    //Creating a sightline for the "Enemies".
     if(collisionDetect(Player, tempView)){
        Enemies[i].isInRange = true;
    }
    
    //Using Pythagoras theorem to draw a direct line between the middel of the "Player" and "Enemies".
    var a = (Player.x + (Player.w / 2)) - (Enemies[i].x + (Enemies[i].w / 2));
    var b = (Player.y + (Player.h / 2)) - (Enemies[i].y + (Enemies[i].h / 2));
    var c = Math.sqrt( a*a + b*b );
    var maxDist = 200;
    
    //Telling what the "Enemies" should do the "Player" is in range on the different axis and adding a timer to reduce the number of time in 1 second it will perform these actions for optimization.
    if(Enemies[i].isInRange == true){
        if(c > maxDist){
            Enemies[i].isInRange = false;
            Enemies[i].seeTimer = 0;
        } else if(Player.y + Player.h < Enemies[i].y){
            if(Enemies[i].seeTimer >= 240){
                Enemies[i].isInRange = false;
                Enemies[i].seeTimer = 0;
            } else if(Enemies[i].seeTimer < 240){
                Enemies[i].seeTimer += 1;
            }
        } else if (Player.y > Enemies[i].y + Enemies[i].h){
            if(Enemies[i].seeTimer >= 240){
                Enemies[i].isInRange = false;
                Enemies[i].seeTimer = 0;
            } else if(Enemies[i].seeTimer < 240){
                Enemies[i].seeTimer += 1;
            }
        }
    }
}

//Creating a variable "movePlayer" as a function to move the "Player" on the x-axis as well as if the "Player" should be using "playerFall" or "playerJump".
var movePlayer = function(){
    //Making a for each statement that will reduce the distance the "Player" will travel until it isnt coliding with any of the "Blocks"
    for (var s = Player.xSpeed; s > 0; s--){
        if(placeFree(Player.x + s * Player.xDir, Player.y) == true){
            Player.x += s * Player.xDir;
            break;
        }
    }
    
    //Switching between "playerJump" and "playerFall" based on the value of "jumpSpeed" which is a local variable of "Player".
    if(Player.jumpSpeed > 0){
        playerJump();
        
    } else if (Player.jumpSpeed <= 0){
        playerFall();  
    } 
};

//Creating a variable "playerJump" as a function to mimic an upwards force that will slowly reduce due to artificial gravity.
var playerJump = function(){
    //Setting up a for each statement to check with all of the "Blocks".
    for (var i = 0; i < (Player.jumpSpeed); i += 0.1){
        //Letting the "Player" move if it will not end up inside of a "Block".
        if(placeFree(Player.x, Player.y - (Player.jumpSpeed - (g - i)))){
            Player.y -= Player.jumpSpeed - g - i;
            break;
        }
        //If there is no more force then it will change to "playerFall".
        if (Player.jumpSpeed - g - i <= 0){
            g = 0;
            Player.jumpSpeed = 0;
        } 
    }
    //Mimicing gravity.
    g += Player.Gravity;
    if (Player.jumpSpeed - g <= 0){
        g = 0;
        Player.jumpSpeed = 0;
    }
}

//Creating a variable "playerFall" as a function to mimic the effeckts of gravity on the "Player". 
var playerFall = function(){
    //The "Player" will always use "playerFall" before it uses "playerJump" and this if statement will change it.
    if(Player.jumpNow == true && (placeFree(Player.x, Player.y + 1)) == false){
       Player.jumpSpeed = Player.jumpHeight;
    }
    
    //Creating constant gravity that mimics real life gravity.
    g += Player.Gravity
    for (var i = 0; i < g; i += 0.05){
        if(placeFree(Player.x, Player.y + (g - i))){
            Player.y += g - i;
            break;
        } else {
            g = 0;
            break;
        }
    }
}

//Creating a variable "placeFree" as a function to determin if the "Player" can move to it's new position.
var placeFree = function(xNew, yNew){
    //Creating a temporary rectangle that mimics the "Player".
    var tempObj = {x: xNew, y: yNew, w: Player.w, h: Player.h};
    //Creating a for each statement to check between all of the "Blocks".
    for (var i = 0; i < Display.Blocks.length; i++){
        //If it hits even one "Block" then it will return false.
        if(collisionDetect(tempObj, Display.Blocks[i]) == true){
            return false;
        } else {
            //If it doesnt hit one then it will return true.
            if(i == Display.Blocks.length - 1){
            return true;
            }
        }
    }
}

//Creating a variable "collisionDeteect" as a function to determin if two rectangles colide with eachother and return a value of either true or false based on the result.
var collisionDetect = function(r1, r2){
  if (r1.x + r1.w > r2.x &&
      r1.x < r2.x + r2.w &&
      r2.y + r2.h > r1.y &&
      r2.y < r1.y + r1.h) {
      return true;
  } else {
    return false;
  }
}

var RestartEnemies = function(i){
    Enemies[i].x = Enemies[i].RestartX;
    Enemies[i].y = Enemies[i].RestartY;
    Enemies[i].isInRange = false;
}

var RestartPlayer = function(){
    Player.x = Player.RestartX;
    Player.y = Player.RestartY;
    
    Player.Damage = 0;
}