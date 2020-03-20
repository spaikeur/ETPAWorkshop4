function updt(){
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
	}
}
