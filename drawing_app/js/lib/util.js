function EventEmitter() {
	this.listeners = {};
}

EventEmitter.prototype = {
	emit: function(eventType, data) {
		var eventFns = this.listeners[eventType];
		if (eventFns) {
			var handlerArgs = Array.prototype.slice.call(arguments, 1);

			for (var i = 0; i < eventFns.length; i++) {
				var fn = eventFns[i];
				fn.apply(this, handlerArgs);
			}
		}
		else {
			console.log("Listener not found for: " + eventType);
		}
		return this;
	}
  , on: function(eventType, handler) {
		if (!this.listeners[eventType]) {
			this.listeners[eventType] = [];
		}
		this.listeners[eventType].push(handler);
		return this;
	}
};
