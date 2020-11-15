import Phaser from 'phaser';

class PlayScene extends Phaser.Scene {

  constructor() {
    super('PlayScene');
  }

  create() {
    this.isGameRunning = false;
    this.gameSpeed = 10;
    // Receive the Height and Width from this.game.config
    const { height, width } = this.game.config;

    this.startTrigger = this.physics.add.sprite(0,10).setOrigin(0,1).setImmovable();
    // Adding the ground using tileSprite(x, y, width, height, imageFileToDisplay), which- 
    //- can be scrolled infinitely
    this.ground = this.add.tileSprite(0, height, 88, 26, 'ground').setOrigin(0, 1);
    // An Arcade Physics Sprite is a Sprite with an Arcade Physics body and related components.  
    //- The body can be dynamic or static | unlike Arcade Image, Arcade sprite may be animated
    this.dino = this.physics.add.sprite(0, height, 'dino-idle')
      .setOrigin(0, 1)
      // Sets whether this Body collides with the world boundary(ground)
      .setCollideWorldBounds(true)
      .setGravityY(5000);
    // fn() to initialize animations
    this.initAnims();
    // fn() to sense the spaceKey input
    this.handleInputs();
    // fn() to add overlap between the box and dino
    this.initStartTrigger();
  }

  initStartTrigger(){
    const { height, width } = this.game.config;
    this.physics.add.overlap(this.startTrigger, this.dino, () => {
      // Checking if the box is up
      if(this.startTrigger.y === 10){ // y=10 was set in startTrigger() defn
        this.startTrigger.body.reset(0, height); // Move the box to the bottom part of the window
        return;
      }
      // 
      this.startTrigger.disableBody(true, true);

      const startEvent = this.time.addEvent({
        delay: 1000/60, // delay-> how often this fn will be called | this will be exe 60 times/sec
        loop: true, // fn is in infinte loop
        callbackScope: this, // callback will be this context
        callback: () => {
          this.dino.setVelocityX(80);
          this.dino.play('dino-run', 1); // 1 -> Ignore if playing

          if(this.ground.width < width){
            this.ground.width += 17 * 2; // Increases width 34pc everytime the callback is exe
          }

          if(this.ground.width >= width){ // if groundWidth >= canvas => the game can be started
            this.ground.width = width; // Verify if groundWidth === with of canvas
            this.isGameRunning = true;
            this.dino.setVelocity(0); // Stop dino running
            startEvent.remove();
          }
        }
      })

    }, null, this)
  }

  initAnims(){
    this.anims.create({ //Provide a configuration object for the animation
      key: 'dino-run', // To identify the animation with a key
      frames: this.anims.generateFrameNumbers('dino', { start: 2, end: 3 }), // defines set of frames-
      //- within which the animation exists
      frameRate: 10, //Repeating 10 times per second
      repeat: -1 // -1 => will put the repeat in a loop
    }) 

    this.anims.create({ //Provide a configuration object for the animation
      key: 'dino-down-anim', // To identify the animation with a key
      frames: this.anims.generateFrameNumbers('dino-down', { start: 0, end: 1 }), // defines set of frames-
      //- within which the animation exists
      frameRate: 10, //Repeating 10 times per second
      repeat: -1 // -1 => will put the repeat in a loop
    }) 

    this.anims.create({ //Provide a configuration object for the animation
      key: 'enemy-dino-fly', // To identify the animation with a key
      frames: this.anims.generateFrameNumbers('enemy-bird', { start: 0, end: 1 }), // defines set of frames-
      //- within which the animation exists
      frameRate: 6, //Repeating 10 times per second
      repeat: -1 // -1 => will put the repeat in a loop
    }) 
  }

  handleInputs(){
    // Dino Jump
    this.input.keyboard.on('keydown_SPACE', ()=>{
      // Don't set any VelocityY, if the dino is not on the floor
      if(!this.dino.body.onFloor()) { return ; }

      this.dino.body.height=92;
      this.dino.body.offset.y=0; //Offset is reqiured only when kneeling

      // How fast should the dino image land back on the ground
      this.dino.setVelocityY(-1600);
    })
    // Dino Kneel
    this.input.keyboard.on('keydown_DOWN', ()=>{
      // Don't set any VelocityY, if the dino is not on the floor
      if(!this.dino.body.onFloor()) { return ; }
      
      // Change the height of the dino, while kneeling
      this.dino.body.height=58;
      this.dino.body.offset.y=34;
    })
    // Dino Run
    this.input.keyboard.on('keyup_DOWN', ()=>{
      
      // Change the height of the dino, while kneeling
      this.dino.body.height=92;
      this.dino.body.offset.y=0;
    })
  }

  // update() is called 60 times/sec => 60FPS
  update() {
    if(!this.isGameRunninG) { return; } // If the game is not running, don't run below code
    // In every call of the update(), access the ground and update the new location of the image
    this.ground.tilePositionX += this.gameSpeed;

    // Checking if the dino is in the air, by checking to see if it has a velocityY
    if(this.dino.body.deltaAbsY() > 0){
      this.dino.anims.stop(); // Stop all the other animations
      this.dino.setTexture('dino'); // This will assign the image where it is not moving
    }else{ // When dino is running
      // this.dino.play('dino-run', true); //true- will ignore the fn call, if it is already running

      this.dino.body.height <= 58 ? 
          this.dino.play('dino-down-anim', true) : 
          this.dino.play('dino-run', true);
    }
  }
}

export default PlayScene;
