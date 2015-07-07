RockManager = function () {
	this.rocks = new ArrayList();
	this.rockMeshes = new ArrayList();
}

RockManager.prototype.constructor = RockManager;

RockManager.prototype.addRock = function(rock) {
	this.rocks.add(rock);
	this.rockMeshes.add(rock.mesh);
	GlobalScene.add(rock.mesh);
	if (this.indicator) {this.indicator.innerText = ""+this.rocks.size()};
};

RockManager.prototype.removeRock = function(rock) {
	this.rocks.remove(rock);
	this.rockMeshes.remove(rock.mesh);
	GlobalScene.remove(rock.mesh);
	if (this.indicator) {this.indicator.innerText = ""+this.rocks.size()};
};

RockManager.prototype.run = function(now) {
	for (var i = this.rocks.size() - 1; i >= 0; i--) {
		var rock = this.rocks.get(i);
		rock.run(now);
		if (rock.dead) {
			this.removeRock(rock);
		};
	};
};

RockManager.prototype.collision = function(earth) {
	var crashRocks = new ArrayList();
	for (var i = this.rocks.size() - 1; i >= 0; i--) {
		var rock = this.rocks.get(i);
		if (rock.mesh.position.x - rock.mesh.geometry.boundingSphere.radius 
				<= earth.position.x + earth.geometry.boundingSphere.radius) {
			var distance = rock.mesh.position.distanceTo(earth.position);
			if (distance < earth.geometry.boundingSphere.radius + rock.mesh.geometry.boundingSphere.radius) {
				crashRocks.add(rock);
			};
		};
	};
	return crashRocks;
};

RockManager.prototype.removeRocks = function(rocks) {
	for (var i = rocks.size() - 1; i >= 0; i--) {
		this.removeRock(rocks.get(i));
	};
};