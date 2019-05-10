class GameHandler {
	spawnPlayer() {
		scene.model = new Player();
		scene.add(scene.model);
	}

	spawnHostiles() {
		var top_or_side = (Math.random() < 0.5);
		var posX = (top_or_side) ? Math.random()*40-20 : ((Math.random()<0.5)?20:-20);
		var posY = (!top_or_side) ? Math.random()*40-20 : ((Math.random()<0.5)?20:-20);
		var asteroid = new Asteroid(1+Math.random()*5, posX, posY );
		scene.add(asteroid);
	}
}
