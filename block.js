//Creating a function called "block" to contain the code for each individual "block". The two values used is the x and y position.
function block(x,y){
    //Creating local values. x and y is giving at the creating of the individual objects in "display.js". w and h is the size of the "block".
    this.x = x;
    this.y = y;
    this.w = 25;
    this.h = 25;
    
    //Creating a local function called "draw" containing all of the visuel code for the "block".
    this.draw = function(){
    //Stating the color for the "block".
    fill(139,69,19);
    //Creating the rectangle for the "block" with the local values of x,y,w and h.
    rect(this.x, this.y, this.w, this.h);
    }
}