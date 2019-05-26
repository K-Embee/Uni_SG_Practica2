class GameHandler {
	constructor() {
		this.asteroid_spawn_freq = [6500, 6000, 5500, 4500, 3000];
		this.enemy_spawn_prob_per_sec = [0, 0.01, 0.025, 0.035, 0.065];
		this.life_spawn_prob_per_sec = [0.05, 0.05, 0.02, 0.01, 0];
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

	spawnLife() {
		var top_or_side = (Math.random() < 0.5);
		var posX = (top_or_side) ? Math.random()*scene_size_x-scene_size_x/2 : ((Math.random()<0.5)?scene_size_z:-scene_size_z);
		var posY = (!top_or_side) ? Math.random()*scene_size_z-scene_size_z/2 : ((Math.random()<0.5)?scene_size_x:-scene_size_x);
		var life = new PowerUp(posX, posY);
		scene.add(life);
	}

	checkDifficulty(){
		if(score < 100) {
			return 0;
		}
		if(score < 500) {
			return 1;
		}
		if(score < 3000) {
			return 2;
		}
		if(score < 15000) {
			return 3;
		}
		return 4;
	}

	update() {
		var diff = this.checkDifficulty();
		if(started && this.last_second+1000 <= gameTime) {
			if(Math.random() < this.enemy_spawn_prob_per_sec[diff]) this.spawnHostiles();
			if(Math.random() < this.life_spawn_prob_per_sec[diff]) this.spawnLife();
			this.last_second = gameTime;
		}
		if(this.last_asteroid_spawn + this.asteroid_spawn_freq[diff] <= gameTime && (started || scene.updatables.length < 3)) {
			this.spawnAsteroids();
			this.last_asteroid_spawn = gameTime + (Math.random()-0.5)*1000;
		}
	}
}
