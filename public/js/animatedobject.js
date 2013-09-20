var AnimatedObject = Class.extend({
    init: function(app) {
        this.app = app;
        this.behavior = null;
    },
    
    onFrame: function(event) {
        if (this.behavior)
            this.behavior.onFrame(event);
    }
    
});

