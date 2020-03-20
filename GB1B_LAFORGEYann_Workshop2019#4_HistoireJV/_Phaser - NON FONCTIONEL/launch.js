var config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
physics: {
  default: 'arcade',
      arcade: {
      debug: true
    }
  },
  
  scene: [Scene1]
};
var game = new Phaser.Game(config);
function init(){
  cursors = this.input.keyboard.createCursorKeys();

  player = this.physics.add.sprite(100,450,'perso');
  player.setCollideWorldBounds(true);
  player.setBounce(0.01);
  this.physics.add.collider(player,platforms);

  anims.create({
    key:'left',
    frames: this.anims.generateFrameNumbers('perso', {start: 8, end: 13}),
    frameRate: 10,
    repeat: -1
  });
    
  anims.create({
		key:'stop',
		frames: [{key:'perso', frame:0}],
		frameRate: 20
	});
    
    
}



	




	