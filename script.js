let points = [];
let path = [];

function setup() {
  createCanvas(800, 600);

  points = Array(50)
    .fill(0)
    .map(_ => [random(10, width - 10), random(10, height - 10)]);

  path.push(points[0]);

  frameRate(30);
}

function draw() {
  background(51);

  noStroke();

  points.forEach(p => {
    if (path.includes(p)) {
      fill("red");
    } else {
      fill(255);
    }

    ellipse(p[0], p[1], 10, 10);
  });

  let last = path[0];
  path.slice(1).forEach(cur => {
    stroke(255);
    line(last[0], last[1], cur[0], cur[1]);
    last = cur;
  });

  const remaining = points.filter(p => !path.includes(p));
  if (remaining.length === 0) {
    noLoop();

    let last = path[0];
    const cost = path.slice(1).reduce((acc, p) => {
      acc += dist(last[0], last[1], p[0], p[1]);
      last = p;
      return acc;
    }, 0);

    console.log({ cost, avg: cost / path.length });

    return;
  }

  // addClostestToCenter(path, remaining);
  addWithDepth(path, remaining);
}

function addRandom(path, remaining) {
  path.push(random(remaining));
}

function addClostestToCenter(path, remaining) {
  const center = path.reduce(
    (acc, p) => {
      acc[0] += p[0];
      acc[1] += p[1];
      return acc;
    },
    [0, 0]
  );
  center[0] /= path.length;
  center[1] /= path.length;

  fill("blue");
  noStroke();
  ellipse(center[0], center[1], 10, 10);
  const nearest = findClosest(remaining, center[0], center[1]);
  path.push(nearest);
}

function addClosest(path, remaining) {
  const current = path[path.length - 1];
  const nearest = findClosest(remaining, current[0], current[1]);
  path.push(nearest);
}

function addWithMomentum(path, remaining) {
  if (path.length < 2) {
    addClosest(path, remaining);
    return;
  }

  const p1 = path[path.length - 2];
  const p2 = path[path.length - 1];

  const predCenterX = p2[0] + (p2[0] - p1[0]);
  const predCenterY = p2[1] + (p2[1] - p1[1]);

  fill("blue");
  noStroke();
  ellipse(predCenterX, predCenterY, 10, 10);

  let nearest = findClosest(remaining, predCenterX, predCenterY);

  path.push(nearest);
}

function addWithDepth(path, remaining) {
  if (remaining.length === 1) {
    path.push(remaining[0]);
    return;
  }
  function cost(p1, p2, rem) {
    // now add dist from p2 to its next nearest
    const p3 = findClosest(rem.filter(p => p !== p2), p2[0], p2[1]);
    fill("blue");
    ellipse(p3[0], p3[1], 10, 10);
    return dist(p1[0], p1[1], p2[0], p2[1]) + dist(p2[0], p2[1], p3[0], p3[1]);
  }

  const current = path[path.length - 1];

  let nearest;
  let nearestDist = Infinity;
  remaining.forEach(p => {
    const thisDist = cost(current, p, remaining);
    if (thisDist < nearestDist) {
      nearest = p;
      nearestDist = thisDist;
    }
  });

  path.push(nearest);
  return;
  function rec(startP, depth) {
    if (depth === 0) return 0;
    if (depth === 1) {
    }
    remaining.forEach(p => {
      dist(startP[0], startP[1], p[0], p[1]);
    });
  }

  rec(depth);
  dist(cur[0], cur[1]);
}

function findClosest(from, x, y) {
  let nearest = from[0];
  let nearestDist = dist(x, y, nearest[0], nearest[1]);
  from.slice(1).forEach(p => {
    const thisDist = dist(x, y, p[0], p[1]);
    if (thisDist < nearestDist) {
      nearest = p;
      nearestDist = thisDist;
    }
  });
  return nearest;
}

function distToLine(p1, p2, x, y) {
  const num = Math.abs(
    x * (p2[1] - p1[1]) - y * (p2[0] - p1[0]) + p2[0] * p1[1] - p2[1] * p1[0]
  );

  const dem = Math.sqrt((p2[1] - p1[1]) ** 2 + (p2[0] - p1[0]) ** 2);
  console.log(num, dem);
  return num / dem;
}
