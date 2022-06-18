class CharacterObject {//class that will be used to create the character, zombies, and bullets
    constructor(x, y, width, height, color, canvasContext){
        this.x = x;
        this.y = y;
        this.vX = 0;
        this.vY = 0;
        this.width = width;
        this.height = height;
        this.ctx = canvasContext;
        this.color = color;
    }
    updatePosition(){//keeps track of where this object is on the screen
        this.x += this.vX;
        this.y += this.vY;
    }
    draw(){this.ctx.fillRect(this.x, this.y, this.width, this.height)}//puts object at its current position
    left(){return this.x}
    right(){return this.x + this.width}
    top(){return this.y}
    bottom(){return this.y + this.height}
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


//on event start game is clicked, hide main menu
window.onload = () => {

    //create a starting frame count of zero
    let totalFrameCount = 0;
  
    //create a default empty obstacle array (we will add obstacles later)
    //let obstacleArray = [];
  
    //create a default intervalId of null (we will set it with a non-null value later)
    let intervalId = null;
  
    //starts the game when start button is clicked
    document.getElementById('start-button').onclick = () => {
      startGame();
    };
    function startGame(){
        const myCanvas = document.querySelector('canvas');
        const ctx = myCanvas.getContext('2d');

        ///can be used to create background and border when im ready
        // const floorImg = new Image();
        // floorImg.src = './images/floor.png';
        // const borderImg = new Image();
        // borderImg.src = './images/border.png';
        // const myFloor = new ImageObject(0, 0, myCanvas.width, myCanvas.height, ctx, floorImg);
        // const myBorder = new ImageObject(0, 0, myCanvas.width, myCanvas.height, ctx, borderImg);
        const floorTestImg = new Image();
        floorTestImg.src = '../images/floortest.png';

        const myTestfloor = new ImageObject(0, 0, myCanvas.width, myCanvas.height, ctx, floorTestImg)


        const player = new CharacterObject(myCanvas.width/2, myCanvas.height/2, 100, 100, 'red')


        // function createCharacter(){}

        function updateGame(){

            totalFrameCount++;

            if(totalFrameCount % 300 === 0){
                console.log("3 seconds have elapsed")
            }

            player.updatePosition();

            ctx.clearRect(0,0,myCanvas.width,myCanvas.height)
            myTestfloor.draw();
            // player.draw();
        }

        floorTestImg.onload = () =>{
            intervalId = setInterval(updateGame, 1);
        }

        document.addEventListener('keydown', (event) => {
            switch(event.code){
                case 'ArrowLeft':
                    // if(player.vX >= -1){
                    player.vX = 1;
                    // }
                    break;
                case 'ArrowRight':
                    player.vX = 1;
                    break;
                case 'ArrowUp':
                    player.vY = -1;
                    break;
                case 'ArrowDown':
                    player.vY = 1;
                    break;
                case 'Space':
                    //shoot
                    break;
            }
        });
        document.addEventListener('keyup', (event) => {
            switch(event.code){
                case 'ArrowLeft':
                    player.vX = 0;
                    break;
                case 'ArrowRight':
                    player.vX = 0;
                    break;
                case 'ArrowUp':
                    player.vY = 0;
                    break;
                case 'ArrowDown':
                    player.vY = 0;
                    break;
            }
        })
    }
}
