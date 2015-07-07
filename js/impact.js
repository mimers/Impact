var SCENE_WIDHT = 480;
var SCENE_HEIGHT = 280;
var GlobalScene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// var camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
var camera = new THREE.OrthographicCamera(SCENE_WIDHT / -2, SCENE_WIDHT / 2, SCENE_HEIGHT / 2, SCENE_HEIGHT / -2, 1, 3000);
var rockCountIndicator = document.getElementById('rock_count');
var missileCountIndicator = document.getElementById('missile_count');
var crashEarth = document.getElementById('crash_earth');
var boomedIndicator = document.getElementById('boom_count');
var crashEarthCount = 0;
var boomedRockCount = 0;
var renderer = new THREE.WebGLRenderer({antialias: true});
var SCENE_SCALE = window.innerWidth / SCENE_WIDHT;
var rendererWidth = window.innerWidth;
var rendererHeight = SCENE_HEIGHT * SCENE_SCALE;
renderer.setSize(rendererWidth, rendererHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 1500;

var lights = [];
lights[0] = new THREE.PointLight(0xffffff, .8, 0);
lights[1] = new THREE.PointLight(0xffffff, .5, 0);
lights[2] = new THREE.PointLight(0xffffff, .6, 0);

lights[0].position.set(100, 130, 0);
lights[1].position.set(0, 0, 320);
lights[2].position.set(-400, -130, 0);
var light = new THREE.AmbientLight( 0x4f4f4f ); // soft white light
GlobalScene.add( light );
GlobalScene.add(lights[0]);
GlobalScene.add(lights[1]);
GlobalScene.add(lights[2]);

var EARTH_RADIUS = 130;
var geo_sphere = new THREE.SphereGeometry(EARTH_RADIUS, 40, 40);
var earth_map = THREE.ImageUtils.loadTexture("earth.jpg");
var earth_material = new THREE.MeshPhongMaterial({map: earth_map});
var erarth_mesh = new THREE.Mesh(geo_sphere, earth_material);
erarth_mesh.position.x = -200;
erarth_mesh.position.z = 0;
erarth_mesh.rotation.y = 2.3;
GlobalScene.add(erarth_mesh);

var satellites = [];
var SATELLITE_SIZE = 5;
satellites[0] = new THREE.Mesh(new THREE.BoxGeometry(SATELLITE_SIZE,SATELLITE_SIZE,SATELLITE_SIZE), earth_material);
satellites[1] = new THREE.Mesh(new THREE.BoxGeometry(SATELLITE_SIZE,SATELLITE_SIZE,SATELLITE_SIZE), earth_material);
satellites[2] = new THREE.Mesh(new THREE.BoxGeometry(SATELLITE_SIZE,SATELLITE_SIZE,SATELLITE_SIZE), earth_material);
var sateRadius = EARTH_RADIUS + 8;
var sateSkewAngle = 20 / 180 * Math.PI;
satellites[0].position.set(erarth_mesh.position.x + sateRadius * Math.cos(sateSkewAngle), -Math.sin(sateSkewAngle) * sateRadius, erarth_mesh.position.z);
satellites[1].position.set(erarth_mesh.position.x + sateRadius, 0, erarth_mesh.position.z);
satellites[2].position.set(erarth_mesh.position.x + sateRadius * Math.cos(sateSkewAngle), Math.sin(sateSkewAngle) * sateRadius, erarth_mesh.position.z);

GlobalScene.add(satellites[0]);
GlobalScene.add(satellites[1]);
GlobalScene.add(satellites[2]);

// var outMap = THREE.ImageUtils.loadTexture("star.jpg");
// var testGeo = new THREE.PlaneBufferGeometry(220, 110);
// var testMatrial = new THREE.MeshBasicMaterial({map: outMap});
// testMatrial.transparent = true;
// testMatrial.blending = THREE["NnormalBlending"];
// testMatrial.blendsrc = THREE["SrcAlphaFactor"];
// testMatrial.blendDst = THREE["SrcColorFactor"];
// var testMesh = new THREE.Mesh(testGeo, testMatrial);
// testMesh.position.z = 100;
// GlobalScene.add(testMesh);

// var bg_plane = new THREE.PlaneGeometry(SCENE_WIDHT, SCENE_HEIGHT);
// var house_map = new THREE.ImageUtils.loadTexture("house.jpg");
// var house_material = new THREE.MeshPhongMaterial({map: house_map, minFilter: THREE.LinearFilter});
// var bg_mesh = new THREE.Mesh(bg_plane, house_material);
// bg_mesh.position.z = -70;
// GlobalScene.add(bg_mesh);

// var glyder;
// var glyder_map = new THREE.ImageUtils.loadTexture("glyder_map.jpg");
// var loader = new THREE.OBJLoader();
// loader.load("glyder.obj", function (object) {
// 	glyder = object;
// 	glyder.scale.set(0.09, 0.09, 0.09);
// 	glyder.rotation.set(0, 1.5, 0);
// 	GlobalScene.add(glyder);
// })

var starTexture = THREE.ImageUtils.loadTexture("star.jpg");
var starsGeometry = new THREE.Geometry();
for (var i = 0; i < 1000; i++) {
	var v = new THREE.Vector3(
		Math.random() * 500 - 250,
		Math.random() * 500 - 250,
		Math.random() * 500 - 250);
	starsGeometry.vertices.push(v);
};
var starMaterial = new THREE.PointCloudMaterial({size: 50, map: starTexture, blending: THREE.AdditiveBlending, depthTest: true, transparent: true});
var starParticles = new THREE.PointCloud(starsGeometry, starMaterial);
starParticles.scale.set(4,4,4);
GlobalScene.add(starParticles);


var lastBornTime = Date.now();
var BORN_DELAY = 1000;
var rocksManager = new RockManager();
var missilesManager = new MissileManager();
rocksManager.indicator = rockCountIndicator;
missilesManager.indicator = missileCountIndicator;
var runScene = function () {
	
    erarth_mesh.rotation.y += 0.002;
    satellites[0].rotation.x += 0.01;
    satellites[0].rotation.z += 0.01;
    satellites[1].rotation.x += 0.01;
    satellites[1].rotation.z += 0.01;
    satellites[2].rotation.x += 0.01;
    satellites[2].rotation.z += 0.01;
    var now = Date.now();
    if (now - lastBornTime > BORN_DELAY) {
    	var newRock = new Rock();
    	newRock.speed.set(-0.06 * (0.2 + Math.random()), 0.014 * (Math.random() - 0.5), 0);
    	newRock.mesh.position.y = (Math.random() - 0.5) * SCENE_HEIGHT * 0.8;
    	newRock.mesh.position.x = SCENE_WIDHT / 2 + 10;
    	newRock.mesh.position.z = 0;
    	newRock.mesh.rotation.x = 2;
    	rocksManager.addRock(newRock);
    	lastBornTime = now;
    };
    rocksManager.run(now);
    missilesManager.run(now);
    var crashed = rocksManager.collision(erarth_mesh);
    if (crashed.size() > 0) {
	    rocksManager.removeRocks(crashed);
	    crashEarthCount += crashed.size();
    	crashEarth.innerText = ""+crashEarthCount;
    };
    var boomed = missilesManager.collision(rocksManager.rocks);
    if (boomed.size() > 0) {
    	rocksManager.removeRocks(boomed);
    	boomedRockCount += boomed.size();
    	boomedIndicator.innerText = ""+boomedRockCount;
    };
}
var render = function() {
    requestAnimationFrame(render);
    var now = Date.now();
    starParticles.rotation.y = now * 0.00003;
    starParticles.rotation.x = now * 0.00001;
    starParticles.rotation.z = now * 0.00002;
    runScene();
    renderer.render(GlobalScene, camera);
};

function TranslateCoordX (x) {
	return (x - rendererWidth / 2) / SCENE_SCALE;
}
function TranslateCoordY (y) {
	return -(y - rendererHeight / 2) / SCENE_SCALE;
}

renderer.domElement.addEventListener("click", function (event) {
	var x = TranslateCoordX(event.clientX);
	var y = TranslateCoordY(event.clientY);
	var launchPosition = Math.floor((y + SCENE_HEIGHT / 2) / (SCENE_HEIGHT / 3));
	var from = new THREE.Vector3(satellites[launchPosition].position.x, satellites[launchPosition].position.y, 0);
	var angle = Math.atan((y - from.y) / (x - from.x));
	var speed = 0.1;
	var newMissile = new Missile(from,
		new THREE.Vector3(speed * Math.cos(angle), speed * Math.sin(angle), 0),
		new THREE.Vector3(x, y, 0));
	missilesManager.addMissile(newMissile);
})

render();
