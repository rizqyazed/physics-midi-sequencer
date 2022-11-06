
function Circle(x, y, r, n) {
    var options = {
      friction: 0,
      restitution: 0.95
    };
    this.body = Bodies.circle(x, y, r, options);
    this.body.label = n;
    this.r = r;
    Composite.add(engine.world, this.body);

    console.log(this.body);

    this.show = function() {
      var pos = this.body.position;
      var angle = this.body.angle;
      push();
      translate(pos.x, pos.y);
      rotate(angle);
      noStroke()
      fill("#8FB8DE");
      ellipse(0, 0, this.r * 2);
      text(n, 0, 0);
      fill(0);
      pop();
    };
  }