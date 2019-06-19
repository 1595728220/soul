  // retrieve canvas and context
  var canvas = document.getElementById('stage');
  var ctx = canvas.getContext('2d');

  // uniform distribution on sphere
  
  function randomPoint() {
    var theta = 2 * Math.random() * Math.PI;
    var phi = 2 * Math.asin(Math.sqrt(Math.random()));
    return {
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.sin(phi) * Math.sin(theta),
      z: Math.cos(phi)
    }
  }

  // point set
  var numOfPoints = 2000;
  var points = [];

  // create points
  for (var i = 0; i < numOfPoints; i++) {
    points.push(randomPoint())
  }

  // create perspective matrix
  var p = mat4.create();
  mat4.perspective(p, 30, canvas.clientWidth / canvas.clientHeight, 0, 100);

  // create view matrix
  var v = mat4.create();
  var eye = vec3.fromValues(1, 1, -2);
  var center = vec3.fromValues(0, 0, 0);
  var up = vec3.fromValues(0, 1, 0);
  mat4.lookAt(v, eye, center, up);

  // create model matrix
  var m = mat4.create();

  var halfWidth = canvas.clientWidth / 2;
  var halfHeight = canvas.clientHeight / 2;

  function loop() {

    // create pvm matrix
    var vm = mat4.create();
    mat4.multiply(vm, v, m);
    var pvm = mat4.create();
    mat4.multiply(pvm, p, vm);

    // rotate sphere by rotate its model matrix
    mat4.rotateY(m, m, Math.PI / 180);

    // clear screen
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    ctx.save();
    ctx.translate(halfWidth, halfHeight);

    // draw center
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0, 0, 5, 5);

    // draw points
    for (var i = 0; i < numOfPoints; i++) {
      var point = vec3.fromValues(points[i].x, points[i].y, points[i].z);

      // calculate color by depth
      var localPoint = vec3.create();
      vec3.transformMat4(localPoint, point, m);
      ctx.fillStyle = "rgba(0,0,0," + ((1 - localPoint[2]) / 2) + ")";

      // calculate point size
      var pSize = (1 - localPoint[2]);

      // calculate screen position by apply pvm matrix to point
      var screenPoint = vec3.create();
      vec3.transformMat4(screenPoint, point, pvm);

      // draw point
      ctx.fillRect(screenPoint[0] * halfWidth, screenPoint[1] * halfHeight, pSize, pSize);
      
    }

    ctx.restore();

    requestAnimationFrame(loop);
  }

  loop();