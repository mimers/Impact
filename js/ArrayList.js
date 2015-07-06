ArrayList = function () {
	this.array = [];
};

ArrayList.prototype.add = function(e) {
	this.array.push(e);
};

ArrayList.prototype.remove = function(e) {
	for (var i = this.array.length - 1; i >= 0; i--) {
		if (this.array[i] == e) {
			this.array[i] = null;
			for (var j = i; j < this.array.length - 1; j++) {
				this.array[j] = this.array[j+1];
			};
			this.array.length -= 1;
			break;
		}
	};
};

ArrayList.prototype.removeAt = function(index) {
	if (this.array && this.array[index]) {
		this.remove(this.array[index]);
	};
};

ArrayList.prototype.size = function() {
	return this.array ? this.array.length : 0;
};

ArrayList.prototype.get = function(index) {
	return this.array[index];
};

ArrayList.prototype.removeAll = function(es) {
	for (var i = es.size() - 1; i >= 0; i--) {
		this.remove(es[i]);
	};
};