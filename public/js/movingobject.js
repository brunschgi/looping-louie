var MovingObject = Class.extend({
    init: function(app) {
        this.app = app;
        this.velocity = new paper.Point(10.0, 0.0);
        this.acceleration = new paper.Point(0, 0.9);
        this.rotationAcceleration = 0;
        this.rotation = 0;
    },
    
    updatePosition: function(visual) {
        var view = this.app.view;
        
        this.velocity.x = Math.max(0, this.velocity.x + this.acceleration.x);
        this.velocity.y += this.acceleration.y;
        visual.position.x += this.velocity.x;
        visual.position.y += this.velocity.y;
        
        if (this.rotation > 0) {
            this.rotation += this.rotationAcceleration;
            visual.rotate(this.rotation);
        }
        
        var cond = {
            hitBottom: visual.bounds.bottom >= view.bounds.bottom,
            hitTop: visual.bounds.top <= view.bounds.top,
            hitRight: visual.bounds.right >= view.bounds.right,
            leftView: visual.bounds.left > view.bounds.right || visual.bounds.top >= view.bounds.bottom

        };
        if (cond.hitBottom) {
            this.velocity.y *= -0.8;
            visual.position.y = view.bounds.bottom - visual.bounds.height / 2.0;
        }
        if (cond.hitTop) {
            this.velocity.y *= -1.0;
            visual.position.y = visual.bounds.height / 2.0;
        }
        return cond;
        
    },
    
    getMovingState: function(visual) {
        var state = {
            y: visual.position.y,
            vx: this.velocity.x,
            vy: this.velocity.y,
            ax: this.acceleration.x,
            ay: this.acceleration.y
        };
        if (this.rotation) {
            state.r = this.rotation;
            state.ra = this.rotationAcceleration;
        }
        return state;
    },
    
    setMovingState: function(data, visual) {
        if (data.y) {
            visual.position.y = data.y;
            this.velocity.x = data.vx;
            this.velocity.y = data.vy;
            this.acceleration.x = data.ax;
            this.acceleration.y = data.ay;
            if (data.r) {
                this.rotation = data.r;
                this.rotationAcceleration = data.ra;
            }
        }        
    }
});

var ArrivingObject = MovingObject.extend({
    init: function (app) {
        this._super(app);
        this.isHere = false;
    },


    arrives: function (data) {
        this.visual.position.x = -this.visual.bounds.width / 2.0;
        this.setMovingState(data, this.visual);
        this.isHere = true;
    },

    update: function () {
        var view = this.app.view;
        var cond = {};
        if (this.isHere) {
            cond = this.updatePosition(this.visual);


            if (cond.leftView) {
                this.isHere = false;
            }
        }
        return cond;
    }
});
