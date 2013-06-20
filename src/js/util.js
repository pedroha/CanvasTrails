function EventEmitter() {
	this.listeners = {};
}

EventEmitter.prototype = {
	emit: function(name, data) {
		var eventFns = this.listeners[name];
		if (eventFns) {
			var event = {data: data};
			for (var i = 0; i < eventFns.length; i++) {
				var fn = eventFns[i];
				fn(event);
			}
		}
		else {
			console.log("Listener not found for: " + name);
		}
	}
  , on: function(name, eventFn) {
		if (!this.listeners[name]) {
			this.listeners[name] = [];
		}
		this.listeners[name].push(eventFn);
	}
};
