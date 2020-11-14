import Phaser from 'phaser';

class PlayScene extends Phaser.Scene {

  constructor() {
    super('PlayScene');
  }

  create() {
    this.gameSpeed = 10;
    // Receive the Height and Width from this.game.config
    const { height, width } = this.game.config;

    // Adding the ground using tileSprite(x, y, width, height, imageFileToDisplay), which- 
    //- can be scrolled infinitely
    this.ground = this.add.tileSprite(0, height, width, 26, 'ground').setOrigin(0, 1);
    // An Arcade Physics Sprite is a Sprite with an Arcade Physics body and related components.  
    //- The body can be dynamic or static | unlike Arcade Image, Arcade sprite may be animated
    this.dino = this.physics.add.sprite(0, height, 'dino-idle')
      .setOrigin(0, 1)
      // Sets whether this Body collides with the world boundary(ground)
      .setCollideWorldBounds(true)
      .setGravityY(5000);
    // fn() to sense the spaceKey input
    this.handleInputs();
  }

  handleInputs(){

    this.input.keyboard.on('keydown_SPACE', ()=>{
      // Don't set any VelocityY, if the dino is not on the floor
      if(!this.dino.body.onFloor()) { return ; }
      // How fast should the dino image land back on the ground
      this.dino.setVelocityY(-1600);
    })
  }

  // update() is called 60 times/sec => 60FPS
  update() {

    // In every call of the update(), access the ground and update the new location of the image
    this.ground.tilePositionX += this.gameSpeed;
  }
}

export default PlayScene;
