var Louie = AnimatedObject.extend({
    init: function (app) {
        this._super(app);
        this.visual = new paper.Raster('louie');
        this.reset();
        this.resize();
    },

    resize: function() {
        var ratio = (this.app.view.bounds.width / 5) / this.visual.bounds.width;
        this.visual.scale(ratio);
    },
    

    reset: function() {
        this.behavior = null;
        this.visual.position.x = -this.visual.bounds.width / 2.0;
    },
    
    appears: function(data) {
        var self = this;
        var hitRightNotified = false;
        self.reset();
        this.behavior = new LeftToRightBehavior(this.app.view, this.visual, {
            hitRight: function() {
                if (!hitRightNotified) {
                    var data1 = {};
                    self.behavior.getState(data1);
                    self.app.louieIsAboutLeaving(data1);
                    hitRightNotified = true;
                }
            },
            leftView: function() { 
                self.reset();
            },
            onFrame:  function() {
                self.app.chicken.checkCollision(self.visual.bounds, self);
            }
        });
        this.behavior.setState(data);        
    },
    

    push: function (delta) {
        if (this.behavior)
            this.behavior.push(delta);
    }
});
