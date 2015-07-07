var _rock_material = new THREE.MeshLambertMaterial({color: 0x2e2e2e});
var _rock_geometry = new THREE.DodecahedronGeometry(18);

Rock = function () {
	this.mesh = new THREE.Mesh(_rock_geometry, _rock_material);
	this.speed = new THREE.Vector3();
	this.size = 18;
}

Rock.prototype.constructor = Rock;

Rock.prototype.setGeometry = function(geometry) {
	this.mesh.geometry = geometry;
};

Rock.prototype.setMaterial = function(material) {
	this.mesh.material = material;
};

Rock.prototype.run = function(now) {
	if (this.lastRunTime) {
		var ellapse = now - this.lastRunTime;
		var step = new THREE.Vector3(
			ellapse * this.speed.x,
			ellapse * this.speed.y,
			ellapse * this.speed.z);
		this.mesh.position.add(step);
		this.mesh.rotation.x += step.x * 0.1;
		this.mesh.rotation.z += step.x * 0.07;
		if ((this.speed.x >= 0 && this.mesh.position.x > SCENE_WIDHT / 2)
			|| (this.speed.x <= 0 && this.mesh.position.x < -SCENE_WIDHT / 2)
			|| (this.speed.y >= 0 && this.mesh.position.y > SCENE_HEIGHT / 2)
			|| (this.speed.y <= 0 && this.mesh.position.y < -SCENE_HEIGHT / 2)) {
			this.dead = true;
		};
	};
	this.lastRunTime = now;
};
