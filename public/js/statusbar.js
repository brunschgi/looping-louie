var StatusBar = Class.extend({
    init: function (app) {
        this.app = app;
        this.view = app.view;
        this.group = new paper.Group();
        this.rects = {};
        this.players = null;
        this.width = 0;
    },

    resize: function() {
        // TODO: resize status bar
    },

    ground: function(color, heightScale) {
        // draw ground
        var bottomLeft = this.view.bounds.bottomLeft;
        var height = this.view.bounds.height * heightScale;
        var ground = new paper.Path.Rectangle(new paper.Point(bottomLeft.x, bottomLeft.y - height), new paper.Size(this.view.bounds.width, height));
        ground.fillColor = color;
        ground.sendToBack();
    },

    update: function(data) {
        // draw the status bar
        var players = this.players = data.players;
        var rects = this.rects = {};
        var chickens = [];
        var position = 0;
        var width = this.width = this.view.bounds.width / 20;

        this.group.removeChildren();

        for (var id in players) {
            if(players.hasOwnProperty(id)) {
                var player = players[id];
                var chickenColor = player.color.chickenColor;

                // create chickens
                chickens[chickenColor] = [];
                rects[id] = new paper.Path.Rectangle(new paper.Point(position, 0), new paper.Size(4 * width, 0.2 * width));
                rects[id].fillColor = player.color.normal;

                if(id == data.position) {
                    rects[id].bounds.height = 1.3 * width
                }
                else {
                    rects[id].bounds.height = 0.2 * width;
                }

                this.group.addChild(rects[id]);

                for (var i = 0, len = player.lives; i < len; i++) {
                    position += width;
                    var chicken = chickens[chickenColor][i] = new paper.Path.Circle(new paper.Point(position, width * 0.6), width/3);
                    chicken.fillColor = '#ffffff';
                    chicken.strokeWidth = 3;
                    chicken.strokeColor = player.color.normal;

                    this.group.addChild(chickens[chickenColor][i]);
                }

                // add gap
                position += (4 - player.lives) * width;
            }
        }
    },

    updatePosition: function(data) {
        if(this.players) {
            var rects = this.rects;

            for(var id in this.players) {
                if(this.players.hasOwnProperty(id)) {
                    var player = this.players[id];

                    if(id == data.id) {
                        // highlight
                        rects[id].bounds.height = this.width * 1.3;
                    }
                    else {
                        rects[id].bounds.height = this.width * 0.2;
                    }
                }
            }
        }
    }
});
