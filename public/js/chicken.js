var Chicken = AnimatedObject.extend({
    init: function(app, img) {
        this.img = img;
        this.hits = 1;
        this._super(app);
        this.visual = new paper.Raster(this.img + this.hits);
        this.reset();        
    },
    
    reset: function() {        
        this.visual.matrix = new paper.Matrix();
        this.visual.source = this.img + this.hits;
        this.scale();
        var src = new paper.Point();
        src.x = this.app.view.bounds.bottomCenter.x - this.visual.bounds.width / 2;
        src.y = this.app.view.bounds.bottomCenter.y + this.visual.bounds.height * 2;
        
        var target = new paper.Point();
        target.x = src.x;
        target.y = this.app.view.bounds.bottomCenter.y - this.visual.bounds.height / 2;
        
        this.behavior = new AppearBehavior(this.app.view, this.visual, {});
        this.behavior.setup(src, target, new paper.Point(0,-2));
    },

    scale: function() {
        var ratio = (this.app.view.bounds.width / 10) / this.visual.bounds.width;
        this.visual.scale(ratio);        
    },
    resize: function() {
        this.scale();
        if (!this.behavior.isActive()) {
            this.visual.position.x = this.app.view.bounds.bottomCenter.x - this.visual.bounds.width/2;
            this.visual.position.y = this.app.view.bounds.bottomCenter.y - this.visual.bounds.height/2;  
        }
    },
    
    checkCollision: function(bounds, otherObj) {
        if (!this.behavior.isActive() && this.visual.bounds.intersects(bounds)) {
            this.app.pickedChicken();
            this.visual.source = this.img + 'dead';
            this.hits++;
            var self = this;
            var hitRightNotified = false;
            this.behavior = new LeftToRightWithRotationBehavior(this.app.view, this.visual, {
                    hitRight: function() {
                        if (!hitRightNotified) {
                            var data = {};
                            data.img = self.img;
                            self.behavior.getState(data);
                            self.app.chickenIsAboutLeaving(data);
                            hitRightNotified = true;
                        }
                    },
                    leftView: function() {
                        self.reset();
                    }
            });
            this.behavior.velocity = new paper.Point(otherObj.behavior.velocity);
            this.behavior.acceleration = new paper.Point(otherObj.behavior.acceleration);
            this.behavior.velocity.y *= -1.0;
            this.behavior.velocity.y = Math.min(this.behavior.velocity.y,-10.0);
        }
    },
    
});

var PredecessorChicken = AnimatedObject.extend({
    init: function(app) {
        this._super(app);
    },
    
    remove: function() {
        this.behavior = null;
        this.visual.remove();
    },
    
    isActive: function() {
        return this.behavior != null;
    },
    
    appears: function(data) {
        this.visual = new paper.Raster(data.img + 'dead');
        var ratio = (this.app.view.bounds.width / 10) / this.visual.bounds.width;
        this.visual.scale(ratio);        
        
        var self = this;
        var hitRightNotified = false;
        this.behavior = new LeftToRightWithRotationBehavior(this.app.view, this.visual, {
                hitRight: function() {
                    if (!hitRightNotified) {
                        var data1 = {};
                        data1.img = data.img;
                        self.behavior.getState(data1);
                        self.app.chickenIsAboutLeaving(data1);
                        hitRightNotified = true;
                    }
                },
                leftView: function() {
                    self.remove();
                },
                
                onFrame: function(event) {
                    if (self.behavior != null && Math.abs(self.behavior.velocity.length) < 0.5) {
                        self.remove();
                    }                    
                }
        });
        
        this.behavior.setState(data);
        
        if (this.behavior.acceleration.x == 0) {
            this.behavior.acceleration.x = -0.05;
        }
    }
    
});
