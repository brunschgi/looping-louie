var Behavior = Class.extend({
    init: function(view, visual, callbacks) {
        this.view = view;
        this.visual = visual;
        this.callbacks = callbacks;
    },
    
    isActive: function() {
        return false;
    },
    
    onFrame: function(event) {
        if (this.callbacks.onFrame)
            this.callbacks.onFrame(event);
    },
    
    getState: function(data) {
    },
    
    setState: function(data) {
    }
    
});

var LeftToRightBehavior = Behavior.extend({
    init: function(view, visual, callbacks) {
        this._super(view, visual, callbacks);
        this.velocity = new paper.Point(10.0, 0.0);
        this.acceleration = new paper.Point(0, 0.9);  
        this.bottomScaleOffset = 1;
    },
    
    setBottomScaleOffset: function(bottomScaleOffset) {
        this.bottomScaleOffset = bottomScaleOffset;
    },
    
    isActive: function() {
        return true;
    },
    
    getState: function(data) {
        data.y = this.visual.position.y,
        data.vx = this.velocity.x,
        data.vy = this.velocity.y,
        data.ax = this.acceleration.x,
        data.ay = this.acceleration.y
    },
    
    setState: function(data) {
        if (data.y) {
            this.visual.position.y = Math.max(0, Math.min(this.view.bounds.height, data.y));
            this.velocity.x = data.vx;
            this.velocity.y = data.vy;
            this.acceleration.x = data.ax;
            this.acceleration.y = data.ay;
        }        
    },    
    
    push: function(delta) {
        this.velocity.y += delta.y / 10.0;
    },
    
    onFrame: function(event) {
        var view = this.view;
        var visual = this.visual;
        
        this.velocity.x = Math.max(0, this.velocity.x + this.acceleration.x);
        this.velocity.y += this.acceleration.y;
        visual.position.x += this.velocity.x;
        visual.position.y += this.velocity.y;
        
        var bottomOffset = view.bounds.height * this.bottomScaleOffset;
        
        var cond = {
            hitBottom: visual.bounds.bottom >= view.bounds.bottom - bottomOffset,
            hitTop: visual.bounds.top <= view.bounds.top,
            hitRight: visual.bounds.right >= view.bounds.right,
            leftView: visual.bounds.left > view.bounds.right || visual.bounds.top >= view.bounds.bottom
        };
        if (cond.hitBottom) {
            this.velocity.y *= -0.8;
            visual.position.y = view.bounds.bottom - visual.bounds.height / 2.0 - bottomOffset;
        }
        if (cond.hitTop) {
            this.velocity.y *= -1.0;
            visual.position.y = visual.bounds.height / 2.0;
        }
        
        for(key in cond) {
            if (cond[key] && key in this.callbacks) {
                this.callbacks[key]();
            }
        }
        
        this._super(event);        
    }
});

var LeftToRightWithRotationBehavior = LeftToRightBehavior.extend({
    init: function(view, visual, callbacks) {
        this._super(view, visual, callbacks);
        this.rotationFactor = 1.0;
    },

    getState: function(data) {
        this._super(data);
        data.rf = this.rotationFactor;
    },
    
    setState: function(data) {
        this._super(data);
        if (data.r) {
            this.rotationFactor = data.rf;
        }
    },
    
    onFrame: function(event) {
        this.visual.rotate(this.velocity.length * this.rotationFactor);
        this._super(event);
    }

});

var AppearBehavior = Behavior.extend({
    init: function(view, visual, callbacks) {
        this._super(view, visual, callbacks);
    },
    
    setup: function(srcPosition, targetPosition, delta) {
        this.srcPosition = srcPosition;
        this.targetPosition = targetPosition;
        this.delta = delta;
        this.visual.position.x = srcPosition.x;
        this.visual.position.y = srcPosition.y;

    },
    
    isActive: function() {
        return this.delta && 
            (this.visual.position.x != this.targetPosition.x
            || this.visual.position.y != this.targetPosition.y);
    },

    onFrame: function(event) {
        if (this.isActive()) {
        
            var dx = Math.abs(this.targetPosition.x - this.visual.position.x);
            var dy = Math.abs(this.targetPosition.y - this.visual.position.y);
            
            if (dx > Math.abs(this.delta.x) && dx > 1e-5) 
                this.visual.position.x += this.delta.x;
            else
                this.visual.position.x = this.targetPosition.x;

            if (dy > Math.abs(this.delta.y) && dy > 1e-5) 
                this.visual.position.y += this.delta.y;
            else
                this.visual.position.y = this.targetPosition.y;
            
            this._super(event);
        }
    }
});
