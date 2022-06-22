class CharacterObject {
  constructor(x, y, width, height, canvasContext, color) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.vxl = 0;
    this.vxr = 0;
    this.vyu = 0;
    this.vyd = 0;
    this.width = width;
    this.height = height;
    this.ctx = canvasContext;
    this.color = color;
  }
  
  updatePosition(){
    if(this.x >= 0){
      this.x += this.vxl;
      this.x += this.vxr;
    }else{
      this.x -= this.vx - 2;
    }
      this.y += this.vyu;
      this.y += this.vyd;
  }
  
  draw(){
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
//for objects with images
class ImageObject extends CharacterObject {
  constructor(x, y, width, height, canvasContext, imageElement) {
    super(x, y, width, height, canvasContext);
    this.image = imageElement;
  }

  draw(){
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
//for bullets
class BulletObject{
  constructor(x, y, radius, canvasContext, color, aim){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.ctx = canvasContext;
    this.color = color;
    this.aim = aim;
  }
  draw(){
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    this.ctx.fill()
  }
  update(){
    this.draw();
    this.x += this.aim.x;
    this.y += this.aim.y;
  }
}
const menuMusic = new Audio('/music/menusongdark.mp3')
const gameMusic = new Audio('/music/thunder.mp3')
gameMusic.loop = true;
gameMusic.volume = .6;
menuMusic.loop = true;
window.onload = () => {
  //create a starting frame count of zero
  let totalFrameCount = 0;
  //will contain all of the zombies
  let zombieArray = [];
  //will contain all of bullets
  let bulletArray = [];
  let ammoArray = [1, 1, 1, 1, 1, 1];
  // let intervalId = null;
  function reset(){
    setTimeout(() => {
      const myCanvas = document.querySelector('canvas');
      const ctx = myCanvas.getContext('2d');
      menu.style.visibility = 'visible';
      ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
      totalFrameCount = 0;
      zombieArray = [];
      bulletArray = [];
      ammoArray = [1, 1, 1, 1, 1, 1];
      starter = false;
      gameMusic.muted = true;
    }, 5000)
  }
  //button functionality
  const menu = document.getElementById('main-menu');
  const controls = document.getElementById('controls-screen');
  const help = document.getElementById('help-screen');
  const mute = document.querySelector('#mutetoggle');
  var starter = false;
  mute.onclick = () =>{
    if(mute.innerHTML == 'Unmuted'){
      if(!starter){
        menuMusic.muted = true;
      }else{
        gameMusic.muted = true;
      }
      mute.innerHTML = 'Muted'
    }else{
      if(!starter){
        menuMusic.muted = false;
        menuMusic.play();
      }else{
        gameMusic.muted = false;
        gameMusic.play();
      }
      mute.innerHTML = 'Unmuted'
    }
  }
  document.getElementById('start-button').onclick = () => {
    starter = true;
    menuMusic.muted = true;
    if(mute.innerHTML == 'Unmuted'){
      gameMusic.play();
    }
    setTimeout(() =>{
      menu.style.visibility = 'hidden';
      document.getElementById('round').style.visibility = 'visible';
      startGame();
    },500)
  };
  document.getElementById('controls').onclick = () => {
    setTimeout(() =>{
      controls.style.visibility = 'visible'
      menu.style.visibility = 'hidden';
    },100)
  };
  document.getElementById('help').onclick = () => {
    setTimeout(() =>{
      help.style.visibility = 'visible'
      menu.style.visibility = 'hidden';
    },100)
  };
  document.getElementById('back1').onclick = () => {
    setTimeout(() =>{
      menu.style.visibility = 'visible';
      controls.style.visibility = 'hidden';
    },100)
  };
  document.getElementById('back2').onclick = () => {
    setTimeout(() =>{
      menu.style.visibility = 'visible';
      help.style.visibility = 'hidden';
    },100)
  };
  //game loop
  function startGame() {    
    //canvas and context
    const myCanvas = document.querySelector('canvas');
    const ctx = myCanvas.getContext('2d');

    //gets images loaded and ready to be used
    const floorImg = new Image();
    floorImg.src = '/images/floortest.png';

    //creates floor and player
    const myFloor = new ImageObject(0, 0, myCanvas.width, myCanvas.height, ctx, floorImg);
    const player = new CharacterObject(myCanvas.width/2, myCanvas.height/2, myCanvas.width/20, myCanvas.width/20, ctx, 'red');
    //zombie class references player
    class ZombieObject extends CharacterObject{
      constructor(x, y, width, height, canvasContext, color, type, image, health){
        super(x, y, width, height, canvasContext, color);
        this.type = type;
        this.image = new Image();
        this.image.src = image;
        this.health = health;
      }
      draw(){
        ctx.save();
        let angle = Math.atan2((player.y+(player.height/2)) - (this.y+(this.height/2)), (player.x+(player.width/2)) - (this.x+(this.width/2)))
        let cx = this.x + 0.5 * this.width
        let cy = this.y + 0.5 * this.height
        ctx.translate(cx, cy)
        ctx.rotate(angle+359.7)
        ctx.translate(-cx, -cy)
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.restore();
      }
      //moves zombies towards player's current position
      update(){
       
        let angle = Math.atan2(player.y - this.y, player.x - this.x)
        this.image.style.transform = `rotate(90deg)`
        this.draw();
        let speed = {
          x: Math.cos(angle) * this.type,
          y: Math.sin(angle) * this.type
        };
        this.x += speed.x;
        this.y += speed.y;
      }
    }
    //gives player more ammo to shoot
    function reload(){
      for(let i = ammoArray.length; i < 6; i++){
      ammoArray.push(1)
      }
    }

    let roundCurrent = 1;
    let roundText = document.querySelector("#round span");
    let difficulty = 1;
    var frames;
    let score = 0;
    let points = document.querySelector("#score span");
    let ammunition = document.querySelector("#ammo span");

    const greenColor = 'green'
    const yellowColor = 'yellow'

    function updateGame(){
      frames = totalFrameCount++;
      ammunition.innerHTML = ammoArray.length;
      roundText.innerHTML = roundCurrent;
      //increases round and difficulty as time goes on/speeds up zombie spawnrate
      if(totalFrameCount % 2000 === 0){
        roundCurrent++;
        difficulty = roundCurrent*20
      }
      //60 fps - spawns zombies in intervals
      if(totalFrameCount % (300-difficulty) === 0){
        let x
        let y
        //spawns zombies on the outside of map
        if (Math.random() < 0.5){
          x = Math.random() < 0.5 ? 0 - player.width : myCanvas.width + player.width;
          y = Math.random()*myCanvas.height;
        }else{
          x = Math.random() * myCanvas.width;
          y = Math.random() < 0.5 ? 0 - player.height: myCanvas.height + player.height;
        }
        if(Math.random() < (0.03*roundCurrent)){
          zombieArray.push(new ZombieObject(x, y, 40, 50, ctx, yellowColor, .4, "/images/yellowzombie.png", 2))
        }else{
          zombieArray.push(new ZombieObject(x, y, 40, 50, ctx, greenColor, .2, "/images/greenzombie.png", 1))
        }
        if(totalFrameCount % (20000) === 0){
          zombieArray.push(new ZombieObject(x, y, 120, 150, ctx, greenColor, .1, "/images/redzombie.png", 5))
        }
      }

      zombieArray.forEach((zombie, index) => {
        zombie.update()
        //zombie and player collision
        const distBetween = Math.hypot(player.x - zombie.x, player.y - zombie.y)
        if(distBetween-zombie.width/2-player.width/2<1){
          runGame = false;
          reset();
        }
        //updates each bullet and detects collision
        bulletArray.forEach((bullet, bulletIndex) => {
          bullet.update()
          if(bullet.x + bullet.radius < 0 || bullet.x - bullet.radius > myCanvas.width || bullet.y + bullet.radius < 0 || bullet.y - bullet.radius > myCanvas.height){
            bulletArray.splice(bulletIndex, 1)
          }
          const distBetween = Math.hypot(bullet.x - (zombie.x+zombie.width/2), bullet.y - (zombie.y+zombie.height/2))
          if(distBetween-zombie.width/2-bullet.radius/2<1){
            //fixes jitter frames when deleting zombies
            setTimeout(() =>{
              zombieArray[index].health -= 1;
              if(zombieArray[index].health < 1){
                zombieArray.splice(index, 1);
              }
            }, 0)
            bulletArray.splice(bulletIndex, 1);
            score+=10;
            points.innerHTML = score;
          }
        })
      })
    }
    let runGame = true;
    function startGame(){ 
      if (runGame === true){
        //update player position
        player.updatePosition();
        //clear canvas
        ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
        //draws floor
        myFloor.draw();
        //draws player
        player.draw();
        //creates zombies in intervals;
        updateGame();
        //moves zombies
      }
    }
    
    //only start the game loop after the road image has finished loading
    floorImg.onload =  () => {
      intervalId = setInterval(startGame, 1)
    };

    //player movement
    document.addEventListener('keydown', (event) => {
      switch(event.code){
        case 'ArrowLeft':
        case 'KeyA':
          player.vxl = -1;
          break;
        case 'ArrowRight':
        case 'KeyD':
          player.vxr = 1;
          break;
        case 'ArrowUp':
        case 'KeyW':
          player.vyu = -1;
          break;
        case 'ArrowDown':
        case 'KeyS':
          player.vyd = 1;
          break;
        case 'KeyR':
          reload();
      }
    });

    //stop the player if no key is pressed
     document.addEventListener('keyup', (event) => {
      switch(event.code){
        case 'ArrowLeft':
        case 'KeyA':
          player.vxl = 0;
          break;
        case 'ArrowRight':
        case 'KeyD':
          player.vxr = 0;
          break;
        case 'ArrowUp':
        case 'KeyW':
          player.vyu = 0;
          break;
        case 'ArrowDown':
        case 'KeyS':
          player.vyd = 0;
          break;
      }
    });
    myCanvas.onclick = (e) => {
      //gets angle between player and mouse
      const angle = Math.atan2((e.clientY-e.target.getBoundingClientRect().top)-(player.y+(player.height/2)), 
      (e.clientX-e.target.getBoundingClientRect().left)-(player.x+(player.width/2)))
      const velocity = {
        x: Math.cos(angle) *2.5,
        y: Math.sin(angle) *2.5
      }
      if(ammoArray.length >= 1){
      ammoArray.splice(0, 1);
      bulletArray.push(new BulletObject(player.x+(player.width/3), player.y+(player.height/3), player.width/6, ctx, 'white', velocity))
      }
    }
  }
}