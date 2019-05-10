class GameHandler {
	constructor() {
		this.asteroid_spawn_freq = 3000;
		this.enemy_spawn_prob_per_sec = 0.065;
		this.last_second = gameTime;
		this.last_asteroid_spawn = gameTime;
	}

	spawnPlayer() {
		scene.model = new Player();
		scene.add(scene.model);
	}

	spawnAsteroids() {
		var top_or_side = (Math.random() < 0.5);
		var posX = (top_or_side) ? Math.random()*40-20 : ((Math.random()<0.5)?20:-20);
		var posY = (!top_or_side) ? Math.random()*40-20 : ((Math.random()<0.5)?20:-20);
		var asteroid = new Asteroid(1+Math.random()*5, posX, posY );
		scene.add(asteroid);
	}

	spawnHostiles() {
		var top_or_side = (Math.random() < 0.5);
		var posX = (top_or_side) ? Math.random()*40-20 : ((Math.random()<0.5)?20:-20);
		var posY = (!top_or_side) ? Math.random()*40-20 : ((Math.random()<0.5)?20:-20);
		var enemy = new Enemy(posX, posY );
		scene.add(enemy);
	}

	update() {
		if(this.last_second+1000 <= gameTime) {
			if(Math.random() < this.enemy_spawn_prob_per_sec) this.spawnHostiles();
			this.last_second = gameTime;
			console.log("a")
		}
		if(this.last_asteroid_spawn + this.asteroid_spawn_freq <= gameTime) {
			this.spawnAsteroids();
			this.last_asteroid_spawn = gameTime;
		}
	}
}
