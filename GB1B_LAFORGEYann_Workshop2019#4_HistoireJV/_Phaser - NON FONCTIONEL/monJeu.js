var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
scene: {
		init: init,
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);
var score = 0;
var	jumpCount = 0;
var	playerLife = 3;
var foesLife = 3;

function init(){
 	var platforms;
	var player;
	var cursors; 
	var stars;
	var scoreText;
	var bomb;
	var lifeText;
	var foes;
	var projectiles;
}

function preload(){
	this.load.image('background','_img/Background800x600.png');	
	this.load.image('fond','_img/ground.png');
	this.load.image('etoile','_img/Etoile.png');
	this.load.image('vie','_img/Etoile_Vie.png')
	this.load.image('sol','_img/platform.png');
	this.load.image('bomb','_img/Bombe.png');
	this.load.image('projectile','_img/projectiles.png');
	this.load.image('ennemi','_img/Etoile_Ennemi.png');
	this.load.spritesheet('perso','_img/adventurer-SheetW.png',{frameWidth: 24, frameHeight: 35});
}

function create(){
	this.add.image(0,0,'background').setOrigin(0,0);

	platforms = this.physics.add.staticGroup();
	platforms.create(400,568,'fond');
	platforms.create(600,400,'sol');
	platforms.create(50,250,'sol');
	
	player = this.physics.add.sprite(100,450,'perso');
	player.setCollideWorldBounds(true);
	player.setBounce(0.01);
	player.body.setGravityY(000);
	this.physics.add.collider(player,platforms);
	
	cursors = this.input.keyboard.createCursorKeys();
	shootRight = this.input.keyboard.addKey('D');
	shootLeft = this.input.keyboard.addKey('Q');

	var timeSinceLastIncrement = 0;

	this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('perso', {start: 8, end: 13}),
		frameRate: 10,
		repeat: -1
	});
	
	this.anims.create({
		key:'stop',
		frames: [{key: 'perso', frame:0}],
		frameRate: 20
	});
	
	stars = this.physics.add.group({
		key: 'etoile',
		repeat:11,
		setXY: {x:12,y:0,stepX:70}
	});
	
	healstars = this.physics.add.group({
		key: 'vie',
		setXY : {x:410, y: 105}
	});
}

function update(){
	if(cursors.left.isDown){
		player.anims.play('left', true);
		player.setVelocityX(-300);
		player.setFlipX(true);
	}else if(cursors.right.isDown){
		player.setVelocityX(300);
		player.anims.play('left', true);
		player.setFlipX(false);
	}else{ 
		player.anims.play('stop', true);
		player.setVelocityX(0);
	}
		
	if(cursors.down.isDown && !player.body.touching.down){
		player.setVelocityY(300);
	}
	  
	if(cursors.up.isDown && player.body.touching.down){
		player.body.touching.down
		player.setVelocityY(-330);	
	}else if(cursors.up.isUp && !player.body.touching.down){
		this.time.addEvent({
			delay: 100,
			callback: ()=>{
				if(cursors.up.isDown  && jumpCount <1){
					doubleJump(player)
				}
			},
		})	
	}
	  
	if(player.body.touching.down){
		jumpCount = 0;
	}
		
	if (Phaser.Input.Keyboard.JustDown(shootRight)) {
		fireLaserRight();
	}
	if (Phaser.Input.Keyboard.JustDown(shootLeft)) {
		fireLaserLeft();
	}
}

function doubleJump(player){
	player.setVelocityY(-330);
	jumpCount += 1;
}

function hitBomb(player, bombs){
	playerLife -= 1;
	lifeText.setText('Vie: '+playerLife);
	bombs.disableBody(true,true);
	if(playerLife == 0){
		lifeText.setText('Vie: Mort');
		this.physics.pause();
		player.setTint(0xff0000);
		player.anims.play('turn');
		gameOver=true;
	}
}

function fireLaserRight(){
	var projectile = projectiles.create(player.x, player.y,'projectile');
	projectile.setVelocityX(300);

}

function fireLaserLeft(){
	var projectile = projectiles.create(player.x, player.y,'projectile');
	projectile.setVelocityX(-300);
	projectile.setGravityY(0);
}

function hitProjectiles(projectiles,foes){
	foesLife -= 1;
	projectiles.disableBody(true,true);
	if(foesLife == 0){
		foes.disableBody(true,true);
	}
}

function hitFoes(player, foes){
	playerLife -= 1;
	lifeText.setText('Vie: '+playerLife);
	foes.disableBody(true,true);
	if(playerLife == 0){
		lifeText.setText('Vie: Mort');
		this.physics.pause();
		player.setTint(0xff0000);
		player.anims.play('turn');
		gameOver=true;
	}
}

function bombHitStar(bombs, stars){
	bombs.setVelocity(400);
}


function heal(player, healstars){
	if(playerLife < 3){
		playerLife += 1;
		lifeText.setText('Vie: '+playerLife);
		var x = (player.x < 400) ? 
			Phaser.Math.Between(400,800):
			Phaser.Math.Between(0,400);
		var y = (player.y < 400);
		
		var foe = foes.create(x, 500, 'ennemi');
		foe.setCollideWorldBounds(true);
		foe.setBounce(1);
		foe.setVelocityX(Phaser.Math.Between(-300, 300), 30);
	}
	healstars.disableBody(true,true);
}

function healFoe(foes, healstars){
	if(foesLife < 3){
		foesLife += 1;
	}
	healstars.disableBody(true, true);
}

function collectStar(player, star){
	star.disableBody(true,true);
	score += 10;
	scoreText.setText('score: '+score);
	if(stars.countActive(true)===0){
		stars.children.iterate(function(child){
			child.enableBody(true,child.x,0, true, true);
		});

		healstars.children.iterate(function(child){
			child.enableBody(true,child.x,0, true, true);
		});

		var x = (player.x < 400) ? 
			Phaser.Math.Between(400,800):
			Phaser.Math.Between(0,400);
		var y = (player.y < 400);

		var bomb = bombs.create(x, 16, 'bomb');
		
		bomb.setBounce(1);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
	}
}