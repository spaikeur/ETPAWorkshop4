class Scene1 extends Phaser.Scene {
  constructor() {
    super("premiere_scene")
  }

  preload(){
    this.load.image('background','_img/Background800x600.png');	
    this.load.image('fond','_img/ground.png');
    this.load.image('sol','_img/platform.png');
    this.load.spritesheet('perso','_img/adventurer-SheetW.png',{frameWidth: 24, frameHeight: 35});
  }

  create(){
    this.add.image(0,0,'background').setOrigin(0,0);
    cursors = this.input.keyboard.createCursorKeys();
    platforms = this.physics.add.staticGroup();
      
  }

  update(){
    updt();
  }
}


