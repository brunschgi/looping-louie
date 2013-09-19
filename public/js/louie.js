var Louie = Class.extend({
    init: function (app) {
        this.app = app;
        this.isHere = false;
        this.velocity = new paper.Point(10.0, 0.0);
        this.acceleration = new paper.Point(0, 0.9);

        this.visual = new paper.Path.Circle({
            center: new paper.Point(-20, 0),
            radius: 20,
            fillColor: 'red'
        });
    },

    isAboutLeaving: function () {
        this.app.isAboutLeaving({
            y: this.visual.position.y,
            vx: this.velocity.x,
            vy: this.velocity.y,
            ax: this.acceleration.x,
            ay: this.acceleration.y
        });
    },


    arrives: function (data) {
        this.visual.position.x = -this.visual.bounds.width / 2.0;
        if (data.y) {
            this.visual.position.y = data.y;
            this.velocity.x = data.vx;
            this.velocity.y = data.vy;
            this.acceleration.x = data.ax;
            this.acceleration.y = data.ay;
        }
        else {
            console.log('!!!!!!!!!!!initial start');
        }
        this.isHere = true;
    },

    update: function () {
        var view = this.app.view;
        if (this.isHere) {
            this.velocity.x += this.acceleration.x;
            this.velocity.y += this.acceleration.y;
            this.visual.position.x += this.velocity.x;
            this.visual.position.y += this.velocity.y;

            var hitBottom = this.visual.bounds.bottom >= view.bounds.bottom;
            var hitTop = this.visual.bounds.top <= view.bounds.top;
            var hitRight = this.visual.bounds.right >= view.bounds.right;
            var leftView = this.visual.bounds.left > view.bounds.right;

            if (hitBottom) {
                this.velocity.y *= -0.8;
                this.visual.position.y = view.bounds.bottom - this.visual.bounds.height / 2.0;
            }
            if (hitTop) {
                this.velocity.y *= -1.0;
                this.visual.position.y = this.visual.bounds.height / 2.0;
            }

            if (hitRight) {
                this.isAboutLeaving();
            }

            if (leftView) {
                this.isHere = false;
            }
            if (this.visual.bounds.intersect(this.app.chicken.visual.bounds)) {
                this.app.pickedChicken();          
            }
        }
    },

    push: function (delta) {
        this.velocity.y += delta.y / 10.0;
    }
});
