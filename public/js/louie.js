var Louie = ArrivingObject.extend({
    init: function (app) {
        this._super(app);
        this.visual = new paper.Raster('louie');

        this.resize();
    },

    resize: function() {
        var ratio = (this.app.view.bounds.width / 8) / this.visual.bounds.width;
        this.visual.scale(ratio);
    },


    update: function () {
        var cond = this._super();
        if (this.isHere) {
            if (cond.hitRight) {
                this.app.louieIsAboutLeaving(this.getMovingState(this.visual));
            }
            this.app.chicken.checkCollision(this.visual.bounds, this);
        }
    },

    push: function (delta) {
        this.velocity.y += delta.y / 10.0;
    }
});
