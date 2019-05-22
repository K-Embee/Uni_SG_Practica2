class ResourceHandler {
	constructor() {
		this.spheres = Array();
		this.material_lambert = Array();
		this.material_toon = Array();
		this.MAX_GEOMETRIES = 200;
		this.MAX_MATERIALS = 100;
		for(var i = 0; i < this.MAX_GEOMETRIES; i++) {
			this.spheres.push(new THREE.SphereGeometry(1,16,16));
			if(i >= this.MAX_MATERIALS) continue;
			this.material_lambert.push(new THREE.MeshLambertMaterial());
			this.material_toon.push(new THREE.MeshToonMaterial());
		}
		console.log(this.material_toon);
	}

	getAsteroid(mesh, scale, color){
		var geometry = this.spheres.pop();
		var material = this.material_toon.pop();
		material.color.set(color);
		mesh.geometry = geometry;
		mesh.material = material;
		mesh.scale.set(scale,scale,scale);
	}

	getProjectile(mesh, scale, color){
		var geometry = this.spheres.pop();
		var material = this.material_lambert.pop();
		material.color.set(color);
		material.emissive.set(color);
		mesh.geometry = geometry;
		mesh.material = material;
		mesh.scale.set(scale,scale,scale);
	}

	returnAsteroid(mesh) {
		this.spheres.push(mesh.geometry);
		this.material_toon.push(mesh.material);
		mesh.geometry = null;
		mesh.material = null;
	}

	returnProjectile(mesh) {
		this.spheres.push(mesh.geometry);
		this.material_lambert.push(mesh.material);
		mesh.geometry = null;
		mesh.material = null;
	}

	unload(){
		for(var i = this.MAX_GEOMETRIES-1; i >= 0; i--) {
			this.spheres[i].dispose();
			this.spheres.splice(i,1);
			if(i >= this.MAX_MATERIALS) continue;
			this.material_lambert[i].dispose();
			this.material_toon[i].dispose();
			this.material_lambert.splice(i,1);
			this.material_toon.splice(i,1);
		}
	}
}
