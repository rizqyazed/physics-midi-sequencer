var Engine = Matter.Engine,
    Bodies = Matter.Bodies,
    Runner = Matter.Runner,
    Events = Matter.Events,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Composite = Matter.Composite;

// VARIABLES
var engine;
var runner;
var circles = [];
var ground;
var ms;
var intSelect;
var outSelect;

function setup() {
  // CANVAS
  var canvas = createCanvas(550, 600);

  // SITE UI  
  intSelect = createSelect();
  outSelect = createSelect();

  //MATTER JS PHYSICS ENGINE
  engine = Engine.create();

  runner = Runner.create();

  ground = Bodies.rectangle(width/2, height, width, 50, { isStatic: true });

  wall1 = Bodies.rectangle(0, height/2, width, 50, { isStatic: true, angle:PI / 2 });
  wall2 = Bodies.rectangle(width, height/2, width, 50, { isStatic: true, angle:PI / 2 });
  //WEBMIDI SECTION
  WebMidi.enable(function(err) { //check if WebMidi.js is enabled
    if (err) {
      console.log("WebMidi could not be enabled.", err);
    } else {
      console.log("WebMidi enabled!");
    }

    for (i = 0; i < WebMidi.inputs.length; i++) {
      intSelect.option(WebMidi.inputs[i].name, i);
    }
    for (i = 0; i < WebMidi.outputs.length; i++) {
      outSelect.option(WebMidi.outputs[i].name, i);
    }

  // WHEN THE MIDI IS PLAYED
  WebMidi.inputs[2].addListener('noteon', "all",
      function(e) {
        //the function you want to trigger on a 'note on' event goes here
        console.log(e.note.name);
        print(intSelect.value())
        circles.push(new Circle(random(10, width-10), height/2, 25, e.note.name + e.note.octave))
      }
    );
  });

  // EVENT WHEN COLLISION
  Events.on(engine, 'collisionStart', function(event){
      var pairs = event.pairs;
      var notes = []
      var a = pairs[0].bodyA.label;
      var b = pairs[0].bodyB.label;
      if (a === "Rectangle Body") {
        notes.push(b);
      } else if (b === "Rectangle Body") {
        notes.push(a);
      } else {
        notes = [a,b];
      }
      var options = {
        time:1,
        channel:2,
      };
      console.log(a, b);
      WebMidi.outputs[outSelect.value()].playNote(notes);
      WebMidi.outputs[outSelect.value()].stopNote(notes, options);
  })

  var cursormouse = Mouse.create(canvas.elt);
  cursormouse.pixelRatio = pixelDensity();
  print(cursormouse)
  var mouseOptions = {
    mouse: cursormouse
  }
  var mContraint = MouseConstraint.create(engine, mouseOptions);
  Composite.add(engine.world, mContraint);
  console.log(mContraint);

  Composite.add(engine.world, [ground, wall1, wall2]);


  Runner.run(runner, engine);
}

function draw() {
  background(220);
  for (var i = 0; i < circles.length; i++) {
    circles[i].show();
  }
}
