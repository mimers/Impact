var _missile_material = new THREE.MeshPhongMaterial({color: 0x2e22222});
var _missile_geometry = new THREE.OctahedronGeometry(14);

Missile = function (target) {
	this.mesh = new THREE.Mesh(_missile_geometry, _missile_material);
	this.speed = new THREE.Vector3();
	this.size = 14;
	this.target = new THREE.Mesh(new THREE.RingGeometry(8, 15, 32), _missile_geometry);
	this.target.position = target;
}

Missile.prototype = Rock.prototype;

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

		} else {
			this.mesh.position.add(step);
			this.mesh.rotation.x += step.x * 0.1;
			this.mesh.rotation.z += step.x * 0.07;
		}
	};
	this.lastRunTime = now;
};
