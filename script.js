const SWITCH_MIN = -57;
const SWITCH_MAX = 57;

console.log("loaded script")
function toRadians(deg) {
  return deg * (Math.PI / 180);
}
function toDegrees(rad) {
  return rad / (Math.PI / 180);
}
class Switch {
  constructor () {
    this.THETA_MAX = toRadians(14.5); // radians
    this.HEIGHT = 53.5; // in
    this.LEVEL = toRadians(8); // radians
    this.x = 0; // in
    this.r = 26; // in
    this.weight = 93; // lbs
    this.theta = 0; // radians
    this.f = 0; // perpendicular to the lever arm in lbs
  }
}

class Robot {
  constructor(weight,x) {
    this.weight = weight;
    this.x = x;
    this.r = 0;
    this.beta = 0;
    this.f = 0;
    this.torque = 0;
  }
}

function checkLevel(robots) {
  var net_torque = 100;
  var sg_switch = new Switch();
  while(Math.abs(net_torque) > 10 && Math.abs(sg_switch.theta) < sg_switch.THETA_MAX) {
    sg_switch.f = sg_switch.weight * Math.sin(sg_switch.theta);
    sg_switch.torque = -sg_switch.f * sg_switch.r; // positive torque is anti-clockwise

    net_torque = sg_switch.torque;

    robots.forEach((robot) => {
      robot.r = Math.sqrt(sg_switch.HEIGHT**2 + robot.x**2);
      robot.beta = Math.atan(robot.x / sg_switch.HEIGHT);
      robot.f = Math.sin(robot.beta + sg_switch.theta) * robot.weight;
      robot.torque = -robot.f * robot.r; // positive torque is anti-clockwise

      //update the net torque
      net_torque += robot.torque;
    })
    if (net_torque > 0) {
      sg_switch.theta += toRadians(0.01);
    } else {
      sg_switch.theta -= toRadians(0.01);
    }
  }

  if (Math.abs(sg_switch.theta) < sg_switch.LEVEL) {
    return [true, sg_switch.theta];
  } else {
    return [false, sg_switch.theta];
  }
}

/*
var robots = [];
var x = -30;

while (true) {
  robots = [];
  robots.push(new Robot(150,20));
  robots.push(new Robot(150,x));
  if (checkLevel(robots)) {
    x += 0.5;
  } else {
    break;
  }
}

console.log("maximum: " + (x - 0.5));

*/

function findMinMax(robots, weight) {
  var values = []
  for (var i = SWITCH_MIN; i <= SWITCH_MAX; i += 0.5) {
    if (checkLevel(robots.concat(new Robot(weight, i)))[0]) {
      values.push(i)
    }
  }
  return [values[0], values[values.length - 1]]
}

/* JS ONLY */

var robot1xRange = document.getElementById("robot1xRange");
var robot2xRange = document.getElementById("robot2xRange");
var robot3xRange = document.getElementById("robot3xRange");
var robot1xNumber = document.getElementById("robot1xNumber");
var robot2xNumber = document.getElementById("robot2xNumber");
var robot3xNumber = document.getElementById("robot3xNumber");
var robot1pos = document.getElementById("robot1pos");
var robot2pos = document.getElementById("robot2pos");
var robot3pos = document.getElementById("robot3pos");
var level = document.getElementById("level");
var switchImg = document.getElementById("switch");
var robot1xCalculated = document.getElementById("robot1xCalculated");
var robot2xCalculated = document.getElementById("robot2xCalculated");
var robot3xCalculated = document.getElementById("robot3xCalculated");

var ranges = [robot1xRange, robot2xRange, robot3xRange];
var numbers = [robot1xNumber, robot2xNumber, robot3xNumber];
var weights = [robot1weight, robot2weight, robot3weight];
var pos = [robot1pos, robot2pos, robot3pos];
var calculated = [robot1xCalculated, robot2xCalculated, robot3xCalculated]
ranges.forEach((input,index) => {
  input.addEventListener("input", () => {
    numbers[index].value = input.value;
    updateGraphics()
  })
})

numbers.forEach((input,index) => {
  input.addEventListener("input", () => {
    ranges[index].value = input.value;
    updateGraphics()
  })
})

weights.forEach((input) => {
  input.addEventListener("input", updateGraphics);
})

function updateGraphics() {
  var robots = []
  pos.forEach((e) => e.style.display = "none")
  weights.forEach((w,index) => {
    if (w.value != "") {
      if (numbers[index].value != "") {
        robots.push(new Robot(w.value,ranges[index].value));
        pos[index].style.display = "initial";
        pos[index].style.left = switchImg.offsetLeft + switchImg.width / 2 + (switchImg.width / 114 * ranges[index].value) + "px";
      }
    }
  })
  weights.forEach((w, index) => {
    if (w.value != "" && numbers[index].value == "") {
      console.log(findMinMax(robots, w.value) + ", " + index);
      calculated[index].innerHTML = "possible range: " + findMinMax(robots, w.value);
    } else {
      calculated[index].innerHTML = "";
    }
  })
  var output = checkLevel(robots);
  level.innerHTML = "Level: " + output[0] + ", angle: " + toDegrees(output[1]).toFixed(1);
  document.getElementById("switchContainer").style.transform = "rotate(" + toDegrees(output[1]) * -1 + "deg)"
}

updateGraphics();
/*
for (var i = 0; i < 3; i++) {
    var weight = prompt("enter weight of robot #" + (i+1) + " (or 0 for no robot)")
    if (weight != 0) {
        x = prompt("enter position (in inches) of robot #" + (i+1) + " on rung: ")
        robots.push(new Robot(weight, x))
    }
}

console.log(robots);

if (checkLevel(robots)) {
  console.log("level");
} else {
  console.log("not level")
}
/*
# main

for i in range(3):
    weight = float(input("enter weight of robot #" + str(i+1) + " (or 0 for no robot): "))
    if weight != 0:
        x = float(input("enter position (in inches) of robot #" + str(i+1) + " on rung: "))
        robots.append(Robot(weight, x))
    
print(robots)

if check_level(robots):
    print("LEVEL")
else:
    print("NOT LEVEL")


*/