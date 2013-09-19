var Chicken = Class.extend({
    init: function(app) {
        this.app = app;
        this.visual = new paper.Path.Rectangle({
            point: app.view.bounds.bottomCenter,
            size: [60, 60],
            strokeColor: 'black'                
        });
        this.reset();        
    },
    
    reset: function() {
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
    
    checkIntersection: function(bounds) {
        if (!this.hit && !this.appear && this.visual.bounds.intersects(bounds)) {
            this.hit = true;
            this.app.pickedChicken();
            this.velocity = new paper.Point(this.app.louie.velocity);
            this.acceleration = new paper.Point(this.app.louie.acceleration);
            this.velocity.y *= -1.0;
            this.velocity.y = Math.min(this.velocity.y,-10.0);
        }
    },
    
    update: function() {
        if (this.hit) {
            var view = this.app.view;
            this.velocity.x += this.acceleration.x;
            this.velocity.y += this.acceleration.y;
            this.visual.position.x += this.velocity.x;
            this.visual.position.y += this.velocity.y;

            var hitTop = this.visual.bounds.top <= view.bounds.top;
            var leftView = this.visual.bounds.left > view.bounds.right || this.visual.bounds.top >= view.bounds.bottom;

            if (hitTop) {
                this.velocity.y *= -1.0;
                this.visual.position.y = this.visual.bounds.height / 2.0;
            }


            if (leftView) {
                this.reset();
            }
        }
        if (this.appear) {
            this.visual.position.y -= 2; //this.app.view.height * 0.01;
            this.appear = this.visual.position.y > this.app.view.bounds.bottomCenter.y - this.visual.bounds.height/2;        
        }
    }
});
