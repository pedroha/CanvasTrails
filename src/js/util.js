function EventEmitter() {
	this.listeners = {};
}

EventEmitter.prototype = {
	emit: function(eventType, data) {
		var handlerArgs = Array.prototype.slice.call(arguments, 1);

		var eventFns = this.listeners[eventType];
		if (eventFns) {
			for (var i = 0; i < eventFns.length; i++) {
				var fn = eventFns[i];
				fn.apply(this, handlerArgs);
			}
		}
		else {
			var warning = "Listener not found for: " + eventType;
			if (typeof window !== "undefined") {
				window.alert(warning);
			}
			if (typeof console !== "undefined") {
				console.log(warning);
			}
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
