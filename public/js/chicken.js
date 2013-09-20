var Chicken = AnimatedObject.extend({
    init: function(app, img, lives, groundHeightScale) {
        this.img = img;
        this.hits = 1;
        this.lives = lives;
        this.groundHeightScale = groundHeightScale;
        this._super(app);
        this.visual = new paper.Raster(this.img + this.hits);
        this.reset();        
    },
    
    isGameOver: function() {
        return this.hits > this.lives
    },
    
    reset: function() {        
        if (!this.gameOver()) {
            this.visual.matrix = new paper.Matrix();
            this.visual.source = this.img + this.hits;
            this.scale();
            var src = new paper.Point();
            src.x = this.app.view.bounds.bottomCenter.x - this.visual.bounds.width / 2;
            src.y = this.app.view.bounds.bottomCenter.y + this.visual.bounds.height * 2;
            
            var target = new paper.Point();
            target.x = src.x;
            target.y = this.app.view.bounds.bottomCenter.y
                        - this.visual.bounds.height / 2
                        - (this.app.view.bounds.height * this.groundHeightScale);
        
            this.behavior = new AppearBehavior(this.app.view, this.visual, {});
            this.behavior.setup(src, target, new paper.Point(0,-2));
        } else {
            this.behavior = new Behavior(this.app.view, this.visual, {});
        }
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
        if (this.behavior && this.behavior.setBottomScaleOffset)
            this.behavior.setBottomScaleOffset(this.groundHeightScale);        
        
    },
    
    checkCollision: function(bounds, otherObj) {
        if (!this.gameOver() && !this.behavior.isActive() && this.visual.bounds.intersects(bounds)) {
            this.app.pickedChicken();
            this.visual.source = this.img + 'dead';
            this.hits++;
            var self = this;
            var hitRightNotified = false;
            this.behavior = new LeftToRightWithRotationBehavior(this.app.view, this.visual, {
                    hitRight: function() {
                        if (!hitRightNotified) {
                            var data = {};
                            data.img = self.img + 'dead';
                            self.behavior.getState(data);
                            self.app.chickenIsAboutLeaving(data);
                            hitRightNotified = true;
                        }
                    },
                    leftView: function() {
                        self.reset();
                    }
            });
            this.behavior.setBottomScaleOffset(this.groundHeightScale);                    
            this.behavior.velocity = new paper.Point(otherObj.behavior.velocity);
            this.behavior.acceleration = new paper.Point(otherObj.behavior.acceleration);
            this.behavior.velocity.y *= -1.0;
            this.behavior.velocity.y = Math.min(this.behavior.velocity.y,-10.0);
        }
    },
    
});

var PredecessorChicken = AnimatedObject.extend({
    init: function(app, groundHeightScale) {
        this._super(app);
        this.groundHeightScale = groundHeightScale;
    },
    
    remove: function() {
        this.behavior = null;
        this.visual.remove();
    },
    
    isActive: function() {
        return this.behavior != null;
    },
    
    appears: function(data) {
        this.visual = new paper.Raster(data.img);
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
        this.behavior.setBottomScaleOffset(this.groundHeightScale);                    
        
        if (this.behavior.acceleration.x == 0) {
            this.behavior.acceleration.x = -0.05;
        }
    }
    
});
