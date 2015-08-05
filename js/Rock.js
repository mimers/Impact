// var _rock_material = new THREE.MeshPhongMaterial({color: 0x2e2e2e});
// var _rock_geometry = new THREE.DodecahedronGeometry(18);
var FONT_OPTION = {
	size: 20,
	height: 3,
	curveSegments: 15,
	bevelEnabled: true,
	bevelThickness: 1.2,
	bevelSize: 0.8,
	vevelSegments: 5
};
var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var GEOS = [];
var COLORS = [];
for (var i = 0; i < CHARS.length; i++) {
	var geo = new THREE.TextGeometry(CHARS[i], FONT_OPTION);
	var mat = new THREE.MeshPhongMaterial();
	geo.computeBoundingSphere();
	mat.color.setHSL(1/CHARS.length * (i+1), 0.8, 0.4);
	GEOS.push(geo);
	COLORS.push(mat);
};
Rock = function () {
	var rindex = Math.floor(Math.random() * (CHARS.length - 1));
	this.mesh = new THREE.Mesh(GEOS[rindex], COLORS[rindex]);
	this.speed = new THREE.Vector3();
	this.size = 18;
	this.char = rindex;
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
		this.mesh.rotation.y += step.x * 0.02;
		// this.mesh.rotation.z += step.x * 0.07;
		if ((this.speed.x >= 0 && this.mesh.position.x > SCENE_WIDHT / 2)
			|| (this.speed.x <= 0 && this.mesh.position.x < -SCENE_WIDHT / 2)
			|| (this.speed.y >= 0 && this.mesh.position.y > SCENE_HEIGHT / 2)
			|| (this.speed.y <= 0 && this.mesh.position.y < -SCENE_HEIGHT / 2)) {
			this.dead = true;
		};
	};
	this.lastRunTime = now;
};
