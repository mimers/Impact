MissileManager = function () {
	this.missiles = new ArrayList();
}

MissileManager.prototype.constructor = MissileManager;

MissileManager.prototype.addMissile = function(m) {
	this.missiles.add(m);
	GlobalScene.add(m.mesh);
	GlobalScene.add(m.target);
};

MissileManager.prototype.removeMissile = function(m) {
	this.missiles.remove(m);
	GlobalScene.remove(m.mesh);
	GlobalScene.remove(m.target);
};

MissileManager.prototype.run = function(now) {
	for (var i = this.missiles.size() - 1; i >= 0; i--) {
		var m = this.missiles.get(i);
		m.run(now);
		if (m.dead) {
			this.removeMissile(m);
		};
	};
};

MissileManager.prototype.collision = function(rocks) {
	var affected = new ArrayList();
	for (var i = this.missiles.size() - 1; i >= 0; i--) {
		var m = this.missiles.get(i);
		if (m.arrivalTime && !m.dead) {
			for (var j = rocks.size() - 1; j >= 0; j--) {
				var rock = rocks.get(j);
				if (m.target.position.distanceTo(rock.mesh.position) < m.target.geometry.boundingSphere.radius + rock.mesh.geometry.boundingSphere.radius) {
					affected.add(rock);
				};
			};
		};
	};
	return affected;
};