//Setting up a function called "display" that contains the code for the level or map.
function display(){
    //Creating a local array called "Blocks" that are used to hold all of the "block".
    this.Blocks = [];
    
    //Creating a local function called "Start" and is used at the start of the program to setup all of the different blocks that are used to create the map.
    this.Start = function(){
        this.map1();
    }

    //Creating a local function called "draw" and is used to contain a forEach statement.
    this.draw = function(){
        //calling the draw function for all of the blocks inside of the "Blocks" array.
        this.Blocks.forEach(block => {block.draw();})
    }
    
    this.map1 = function(){
    //Creating all of the blocks that is used as ground.
    for (var i = 0; i < 4; i++){
        this.Blocks.push(new block(0 + i * 25 , 525));
        this.Blocks.push(new block(0 + i * 25 , 500));
        this.Blocks.push(new block(0 + i * 25 , 475));
        if(i > 0){
            this.Blocks.push(new block(-25 + i * 25 , 450));
            this.Blocks.push(new block(-25 + i * 25 , 425));  
        }
    }
        
    for (var i = 0; i < 6; i++){
        //this.Blocks.push(new block(100 + i * 25 , 525));
        //this.Blocks.push(new block(100 + i * 25 , 500));
    }
        
    for (var i = 0; i < 4; i++){
        this.Blocks.push(new block(400 + i * 25 , 525));
        this.Blocks.push(new block(400 + i * 25 , 500));
    }

    //Creating a for statement instead of making them all by hand. This creates the two most lovest line of ground, follow the horizontal line, and a top line, that are out of the screen as to make sure the player doesnt jump out of the screen.
    for (var i = 0; i < (width/25); i++){
        this.Blocks.push(new block(0 + i * 25 , 575));
        this.Blocks.push(new block(0 + i * 25 , 550));
        this.Blocks.push(new block(0 + i * 25 , -50));
    }
    
    //Creating a for statement for two lines that are outside the screen to make sure the player doesnt jump out of the screen, following the vertical line.
    for(var e = 0; e < (height/25); e++){
        this.Blocks.push(new block(-25, 0 + e * 25));
        this.Blocks.push(new block(width, 0 + e * 25));
    }

    this.Blocks.push(new block(225, 400));
	
	this.Blocks.push(new block(325, 425));

	this.Blocks.push(new block(425, 375));
    }
}
