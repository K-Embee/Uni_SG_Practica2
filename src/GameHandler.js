class GameHandler {
	constructor() {
		this.asteroid_spawn_freq = 3000;
		this.enemy_spawn_prob_per_sec = 0;
		this.last_second = gameTime;
		this.last_asteroid_spawn = gameTime;
	}

	spawnPlayer() {
		scene.model = new Player();
		scene.add(scene.model);
	}

	spawnAsteroids() {
		var top_or_side = (Math.random() < 0.5);
		var radius = 1+Math.random()*5;
		var posY = (top_or_side) ? Math.random()*scene_size_x-scene_size_x/2 : ((Math.random()<0.5)?(scene_size_z+radius):-(scene_size_z+radius));
		var posX = (!top_or_side) ? Math.random()*scene_size_z-scene_size_z/2 : ((Math.random()<0.5)?(scene_size_x+radius):-(scene_size_x+radius));
		var asteroid = new Asteroid(radius, posX, posY, false);
		scene.add(asteroid);
	}

	spawnHostiles() {
		var top_or_side = (Math.random() < 0.5);
		var posX = (top_or_side) ? Math.random()*scene_size_x-scene_size_x/2 : ((Math.random()<0.5)?scene_size_z:-scene_size_z);
		var posY = (!top_or_side) ? Math.random()*scene_size_z-scene_size_z/2 : ((Math.random()<0.5)?scene_size_x:-scene_size_x);
		var enemy = new Enemy(posX, posY);
		scene.add(enemy);
	}

	update() {
		if(started && this.last_second+1000 <= gameTime) {
			if(Math.random() < this.enemy_spawn_prob_per_sec) this.spawnHostiles();
			this.last_second = gameTime;
		}
		if(this.last_asteroid_spawn + this.asteroid_spawn_freq <= gameTime && (started || scene.updatables.length < 3)) {
			this.spawnAsteroids();
			this.last_asteroid_spawn = gameTime;
		}
	}
}
