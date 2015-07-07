var _missile_material = new THREE.MeshPhongMaterial({color: 0x1c2222});
var _missile_geometry = new THREE.OctahedronGeometry(14);
var BOOM_DURATION = 300;

Missile = function (from, speed, target) {
	this.mesh = new THREE.Mesh(_missile_geometry, _missile_material);
	this.mesh.position.copy(from);
	this.speed = speed.clone();
	this.size = 14;
	this.target = new THREE.Mesh(new THREE.TorusGeometry(8, 3, 10, 9),
		new THREE.MeshPhongMaterial({color: 0x1011f1}));
	this.target.position.copy(target);
}

Missile.prototype.constructor = Missile;

Missile.prototype.run = function(now) {
	if (this.lastRunTime) {
		var ellapse = now - this.lastRunTime;
		var step = new THREE.Vector3(
			ellapse * this.speed.x,
			ellapse * this.speed.y,
			ellapse * this.speed.z);
		this.target.rotation.z += step.x * 0.05;
		if (this.arrivalTime) {
			this.target.rotation.z += step.x * 0.04;
			this.target.scale.add(new THREE.Vector3(0.01, 0.01, 0.01));
			if (now - this.arrivalTime > BOOM_DURATION) {
				this.dead = true;
			};
		} else {
			this.mesh.position.add(step);
			this.mesh.rotation.x += step.x * 0.1;
			this.mesh.rotation.z += step.x * 0.07;
			if ((this.speed.x >= 0 && this.mesh.position.x >= this.target.position.x)
				|| (this.speed.y >= 0 && this.mesh.position.y >= this.target.position.y)
				|| (this.speed.x <= 0 && this.mesh.position.x <= this.target.position.x)
				|| (this.speed.y <= 0 && this.mesh.position.y <= this.target.position.y)) {
				this.arrivalTime = now;
				GlobalScene.remove(this.mesh);
				this.target.material.color.setRGB(1, 0, 0);
			};
		}
	};
	this.lastRunTime = now;
};
