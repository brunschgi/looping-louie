var Chicken = Class.extend({
    init: function(app) {
        this.visual = new paper.Path.Rectangle({
            center: app.view.bounds.bottomCenter,
            size: [60, 60],
            strokeColor: 'black'                
        });
        this.visual.position.x -= this.visual.bounds.width/2;
        this.visual.position.y -= this.visual.bounds.height/2;        
    },
    
    update: function() {
    }
});
