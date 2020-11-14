import Phaser from 'phaser';

class PlayScene extends Phaser.Scene {

  constructor() {
    super('PlayScene');
  }

  create() {
    // Receive the Height and Width from this.game.config
    const { height, width } = this.game.config;

    // Adding the ground using tileSprite(x, y, width, height, imageFileToDisplay), which- 
    //- can be scrolled infinitely
    this.ground = this.add.tileSprite(0, height, width, 26, 'ground').setOrigin(0, 1);
    
    this.dino = this.physics.add.sprite(0, 0, 'dino-idle').setOrigin(0, 1);
  }

  update() {

  }
}

export default PlayScene;
