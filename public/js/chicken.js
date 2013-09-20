var Chicken = MovingObject.extend({
    init: function(app) {
        this._super(app);
        this.reset();        
    },
    
    reset: function() {
        if (this.visual)
            this.visual.remove();
        this.visual = new paper.Path.Rectangle({
            point: this.app.view.bounds.bottomCenter,
            size: [60, 60],
            strokeColor: 'black'                
        });
        this.visual.position.x = this.app.view.bounds.bottomCenter.x - this.visual.bounds.width/2;
        this.visual.position.y = this.app.view.bounds.bottomCenter.y + this.visual.bounds.height * 2;
        this.appear = true;        
        this.hit = false;
    },
    
    resize: function() {
        if (!this.appear) {
            this.visual.position.x = this.app.view.bounds.bottomCenter.x - this.visual.bounds.width/2;
            this.visual.position.y = this.app.view.bounds.bottomCenter.y - this.visual.bounds.height/2;  
        }
    },
    
    checkCollision: function(bounds, otherObj) {
        if (!this.hit && !this.appear && this.visual.bounds.intersects(bounds)) {
            this.hit = true;
            this.app.pickedChicken();
            this.rotation = otherObj.velocity.length;
            this.velocity = new paper.Point(otherObj.velocity);
            this.acceleration = new paper.Point(otherObj.acceleration);
            this.velocity.y *= -1.0;
            this.velocity.y = Math.min(this.velocity.y,-10.0);
        }
    },
    
    update: function() {
        if (this.hit) {
            var view = this.app.view;
            var cond = this.updatePosition(this.visual);

            if (cond.leftView) {
                this.app.chickenIsAboutLeaving(this.getMovingState(this.visual));
                this.reset();
            }
        }
        
        if (this.appear) {
            this.visual.position.y -= 2; //this.app.view.height * 0.01;
            this.appear = this.visual.position.y > this.app.view.bounds.bottomCenter.y - this.visual.bounds.height/2;        
        }
    }
});

var PredecessorChicken = ArrivingObject.extend({
    init: function(app) {
        this._super(app);
        this.visual = new paper.Path.Rectangle({
            size: [60, 60],
            strokeColor: 'black',
            fillColor: 'red'
        });        
        this.reset();        
    },
    
    reset: function() {
        this.isHere = false;
        this.visual.position.x = -this.visual.bounds.width;
    },
    
    arrives: function(data) {
        this._super(data);
        if (this.acceleration.x == 0) {
            this.acceleration.x = -0.05;
            this.rotationAcceleration = -0.1;
        }
    },
    
    update: function () {
        var cond = this._super();
        var view = this.app.view;
        if (this.isHere) {

            if (cond.hitRight) {
                this.app.chickenIsAboutLeaving(this.getMovingState(this.visual));
            }
            
            if (Math.abs(this.velocity.length) < 0.05) {
                this.reset();
            }
        }
    }
});
