var SCENE_WIDHT = 480;
var SCENE_HEIGHT = 280;
var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// var camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
var camera = new THREE.OrthographicCamera(SCENE_WIDHT / -2, SCENE_WIDHT / 2, SCENE_HEIGHT / 2, SCENE_HEIGHT / -2, 1, 1000);

var renderer = new THREE.WebGLRenderer({antialias: true});
var SCENE_SCALE = window.innerWidth / SCENE_WIDHT;
var rendererWidth = window.innerWidth;
var rendererHeight = SCENE_HEIGHT * SCENE_SCALE;
renderer.setSize(rendererWidth, rendererHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 77;

var lights = [];
lights[0] = new THREE.PointLight(0xffffff, .8, 0);
lights[1] = new THREE.PointLight(0xffffff, .5, 0);
lights[2] = new THREE.PointLight(0xffffff, .6, 0);

lights[0].position.set(100, 130, 0);
lights[1].position.set(0, 0, 320);
lights[2].position.set(-400, -130, 0);
var light = new THREE.AmbientLight( 0x4f4f4f ); // soft white light
scene.add( light );
scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);


var geo_sphere = new THREE.SphereGeometry(60, 40, 40);
var earth_map = THREE.ImageUtils.loadTexture("earth.jpg");
var earth_material = new THREE.MeshPhongMaterial({map: earth_map});
var erarth_mesh = new THREE.Mesh(geo_sphere, earth_material);
erarth_mesh.position.x = -150;
erarth_mesh.position.z = 0;
erarth_mesh.rotation.y = 2.3;
scene.add(erarth_mesh);

var satellites = [];
var SATELLITE_SIZE = 5;
satellites[0] = new THREE.Mesh(new THREE.BoxGeometry(SATELLITE_SIZE,SATELLITE_SIZE,SATELLITE_SIZE), earth_material);
satellites[1] = new THREE.Mesh(new THREE.BoxGeometry(SATELLITE_SIZE,SATELLITE_SIZE,SATELLITE_SIZE), earth_material);
satellites[2] = new THREE.Mesh(new THREE.BoxGeometry(SATELLITE_SIZE,SATELLITE_SIZE,SATELLITE_SIZE), earth_material);

satellites[0].position.set(erarth_mesh.position.x, 80, erarth_mesh.position.z);
satellites[1].position.set(erarth_mesh.position.x + 80, 0, erarth_mesh.position.z);
satellites[2].position.set(erarth_mesh.position.x, -80, erarth_mesh.position.z);

scene.add(satellites[0]);
scene.add(satellites[1]);
scene.add(satellites[2]);


// var bg_plane = new THREE.PlaneGeometry(SCENE_WIDHT, SCENE_HEIGHT);
// var house_map = new THREE.ImageUtils.loadTexture("house.jpg");
// var house_material = new THREE.MeshPhongMaterial({map: house_map, minFilter: THREE.LinearFilter});
// var bg_mesh = new THREE.Mesh(bg_plane, house_material);
// bg_mesh.position.z = -70;
// scene.add(bg_mesh);

var glyder;
var glyder_map = new THREE.ImageUtils.loadTexture("glyder_map.jpg");
var loader = new THREE.OBJLoader();
loader.load("glyder.obj", function (object) {
	glyder = object;
	glyder.scale.set(0.09, 0.09, 0.09);
	glyder.rotation.set(0, 1.5, 0);
	scene.add(glyder);
})
var rock_material = new THREE.MeshPhongMaterial({color: 0x4e4eff});

Rock = function () {
	this.mesh = new THREE.Mesh(new THREE.BoxGeometry(5, 2, 2), rock_material);
	this.speed = new THREE.Vector3();
}

Rock.prototype.run = function(now) {
	if (this.lastRunTime) {
		var ellapse = now - this.lastRunTime;
		var step = new THREE.Vector3(
			ellapse * this.speed.x,
			ellapse * this.speed.y,
			ellapse * this.speed.z);
		this.mesh.position.add(step);
		this.mesh.rotation.x += step.x * 0.1;
	};
	this.lastRunTime = now;
};

RockManager = function () {
	this.rocks = [];
}
RockManager.prototype.addRock = function(rock) {
	this.rocks[this.rocks.length] = rock;
	scene.add(rock.mesh);
};

RockManager.prototype.removeRock = function(rock) {
	for (var i = this.rocks.length - 1; i >= 0; i--) {
		if (this.rocks[i] == rock) {
			this.rocks[i] = null;
			for (var j = i; j < this.rocks.length - 1; j++) {
				this.rocks[j] = this.rocks[j+1];
			};
			this.rocks.length -= 1;
			scene.remove(rock.mesh);
			break;
		}
	};
};

RockManager.prototype.run = function(now) {
	for (var i = this.rocks.length - 1; i >= 0; i--) {
		this.rocks[i].run(now);
	};
};

var lastBornTime = Date.now();
var BORN_DELAY = 1000;
var manager = new RockManager();
var missiles = new RockManager();

var render = function() {
    requestAnimationFrame(render);

    erarth_mesh.rotation.y += 0.002;
    satellites[0].rotation.x += 0.01;
    satellites[0].rotation.z += 0.01;
    satellites[1].rotation.x += 0.01;
    satellites[1].rotation.z += 0.01;
    satellites[2].rotation.x += 0.01;
    satellites[2].rotation.z += 0.01;
    if (glyder) {
    	glyder.rotation.x += 0.02;
    };
    var now = Date.now();
    if (now - lastBornTime > BORN_DELAY) {
    	var newRock = new Rock();
    	newRock.speed.set(-0.03 * (0.2 + Math.random()), 0, 0);
    	newRock.mesh.position.y = (Math.random() - 0.5) * SCENE_HEIGHT * 0.8;
    	newRock.mesh.position.x = SCENE_WIDHT / 2;
    	newRock.mesh.position.z = 0;
    	newRock.mesh.scale.set(3,3,3);
    	newRock.mesh.rotation.x = 2;
    	manager.addRock(newRock);
    	lastBornTime = now;
    };
    manager.run(now);
    missiles.run(now);

    renderer.render(scene, camera);
};

function TranslateCoordX (x) {
	return (x - rendererWidth / 2) / SCENE_SCALE;
}
function TranslateCoordY (y) {
	return -(y - rendererHeight / 2) / SCENE_SCALE;
}

renderer.domElement.addEventListener("click", function (event) {
	var newMissile = new Rock();
	var x = TranslateCoordX(event.x);
	var y = TranslateCoordY(event.y);
	newMissile.mesh.position.set(erarth_mesh.position.x, erarth_mesh.position.y, 0);
	var angle = Math.atan((y - erarth_mesh.position.y) / (x - erarth_mesh.position.x));
	var speed = 0.1;
	newMissile.speed.set(speed * Math.cos(angle), speed * Math.sin(angle), 0);
	missiles.addRock(newMissile);
})

render();
