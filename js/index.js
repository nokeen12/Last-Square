class CharacterObject {
  constructor(x, y, width, height, canvasContext, color) {
    this.x = x;
    this.y = y;
    this.vX = 0;
    this.vY = 0;
    this.width = width;
    this.height = height;
    this.ctx = canvasContext;
    this.color = color;
  }
  
  updatePosition(){
    if(this.x >= 0){
      this.x += this.vX;
    }else{
      this.x -= this.vX - 2;
    }
      this.y += this.vY;
  }
  
  draw(){
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    // console.log(`Player X:${this.x} | Player Y:${this.y}`)
  }
  left() {return this.x}
  right() {return this.x + this.width}
  top() {return this.y}
  bottom() {return this.y + this.height}
  crashWith(obstacle) {return !(this.bottom() < obstacle.top() || this.top() > obstacle.bottom() || this.right() < obstacle.left() || this.left() > obstacle.right())}
}
  
class ImageObject extends CharacterObject {
  constructor(x, y, width, height, canvasContext, imageElement) {
    super(x, y, width, height, canvasContext);
    this.image = imageElement;
  }

  draw(){
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
  
window.onload = () => {
  //create a starting frame count of zero
  let totalFrameCount = 0;
  //will contain all of the zombies
  let zombieArray = [];
  //initializes interval id to be used as a timer later
  let intervalId = null;
  //starts game when you click the start button
  document.getElementById('start-button').onclick = () => {
    startGame();
  };

  //game loop
  function startGame() {    
    //canvas and context
    const myCanvas = document.querySelector('canvas');
    const ctx = myCanvas.getContext('2d');

  //gets images loaded and ready to be used
    const floorImg = new Image();
    floorImg.src = '/images/floortest.png';
    // const playerImg = new Image();
    // playerImg.src = '/images/floortest.png';

    //creates floor and player
    const myFloor = new ImageObject(0, 0, myCanvas.width, myCanvas.height, ctx, floorImg);
    const player = new CharacterObject(myCanvas.width/2, myCanvas.height/2, myCanvas.width/20, myCanvas.height/11.25, ctx, 'red');
    // const mouseTracker = new CharacterObject(myCanvas.width/2, myCanvas.height/2, 1, 1, ctx)
    /**
     * FUNCTION FOR CREATING NEW OBSTACLE
     */
    function createObstacle(){

      //set obstacle width between 20% and 60% of total canvas width
      let rectWidth = Math.floor((Math.random() * (myCanvas.width * 0.4)) + myCanvas.width * 0.2);

      //set obstacle X position between 0 and myCanvas.width - rectWidth
      let rectX = Math.floor(Math.random() * (myCanvas.width - rectWidth))

      //push new obstacle to array of existing obstacles
      // obstacleArray.push(new CharacterObject(rectX, 0, rectWidth, 20, ctx));

    }

    function updateZombies(){
      for (i = 0; i < zombieArray.length; i++){
        zombieArray[i].x += 1;
        zombieArray[i].draw();
      }
      //update frame totalFrameCount
      totalFrameCount++;

      //we have 60 frames per second - so create new obstacle every 4 seconds
      if(totalFrameCount % 300 === 0){
        let leftside = 40;
        let rightside = myCanvas.width-40;
        let top = 40;
        let bottom = myCanvas.height-40;
        zombieArray.push(new CharacterObject(myCanvas.width/10, myCanvas.height/2, player.width, player.height, ctx, 'green'))
      }
    }
    
    function updateGame(){

      
      //update car position
      player.updatePosition();
      // mouseTracker.updatePosition();
      //update obstacle positions
      // for(let i = 0; i < obstacleArray.length; i++){
        
        //update individual obstacle Y position (X does not change for obstacles)
      //   obstacleArray[i].y += 1;

        //detect if obstacle is overlapping with car (collision) - if true, then stop game
      //   if(player.crashWith(obstacleArray[i])){
      //     clearInterval(intervalId);
      //     alert('you crashed!')
      //   };

      // }

      //clear existing canvas
      ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

      //draw road
      // mouseTracker.draw();
      myFloor.draw();

      //draw all obstacles
      // for(let i = 0; i < obstacleArray.length; i++){
      //   obstacleArray[i].draw();
      // }

      //draw car
      player.draw();
      updateZombies();
    }

    
    //only start the game loop after the road image has finished loading
    floorImg.onload =  () => {
      intervalId = setInterval(updateGame, 1)
    };


    //add event listener to change the car's velocity (speed in the X direction) on keydown event
    document.addEventListener('keydown', (event) => {
      switch(event.code){
        case 'ArrowLeft':
        case 'KeyA':
          player.vX = -1;
          break;
        case 'ArrowRight':
        case 'KeyD':
          player.vX = 1;
          break;
      case 'ArrowUp':
      case 'KeyW':
          player.vY = -1;
          break;
      case 'ArrowDown':
      case 'KeyS':
          player.vY = 1;
          break;
      }
    });

    //add event listener to change the car's velocity (speed in the X direction) to zero on keyup event
    document.addEventListener('keyup', (event) => {
      switch(event.code){
        case 'ArrowLeft':
        case 'KeyA':
          player.vX = 0;
          break;
        case 'ArrowRight':
        case 'KeyD':
          player.vX = 0;
          break;
        case 'ArrowUp':
        case 'KeyW':
          player.vY = 0;
          break;
        case 'ArrowDown':
        case 'KeyS':
          player.vY = 0;
          break;
      }
    });
    myCanvas.onmousemove = (e) => {
      //gets x,y position of mouse
      const x = e.clientX
      const y = e.clientY
      //gets the position of the player
      const w = player.x - (player.width/2)
      const h = player.y + (player.height/2)
      //gets distance between mouse and player
      const vX = w - x
      const vY = h - y
      //gets mouse position in radians
      const rad = Math.atan2(vY, vX)
      //convert radians to degrees and round it
      let deg = Math.round(rad *(180 / Math.PI));
      //convert to 360 degrees
      if (deg < 0){deg = (deg + 360) % 360}
      console.log(`Current Degree: ${deg}`);
    } 
  }
}