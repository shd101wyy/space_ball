/*
    0: circle the planet 
    1: flying in line
    
    0: Simple Start
    1: Slow Down 
    2: Speed Up 
    3: press 10 times to project 
    4: Exploding Stars. (Lose )
    5: Reproducing Stars
    6: The Planet that can change the radius
    7: Teleport Star
    
    排行榜

    谁， 说什么， 多少分

    前30名
*/
var GAME_VERSION = 0.02;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var SHOW_MENU = true;
var canvas = document.getElementById("game_canvas");

if (WIDTH > HEIGHT) {
  WIDTH = (HEIGHT / 4) * 3;
}

canvas.width = WIDTH;
canvas.height = HEIGHT;

var 微信分享的内容 = "";

var stage = new createjs.Stage("game_canvas");
createjs.Touch.enable(stage);

var BACKGROUND_COLOR = "#454545";
/*
    draw background
*/
function drawBackground(bg_color) {
  var background = new createjs.Shape();
  background.graphics.beginFill(bg_color).drawRect(0, 0, WIDTH, HEIGHT);
  stage.addChild(background);
}

/*
var circle = new createjs.Shape();
circle.graphics.beginFill("red").drawCircle(0, 0, 50);
circle.x = 100;
circle.y = 100;
stage.addChild(circle);


var txt = new createjs.Text();
txt.font = "bold 96px Impact";
txt.color = "#dd7f7f";
txt.text = "Hello World!";
txt.x = 100;
txt.y = 100;
stage.addChild(txt);
*/
// stage.update();

var COUNT = 0;
var RADIUS_OF_THE_BALL = 10;
var TIME_INTERVAL = 25;
var PLANETS = [];
var PLANETS_START = 0;
var DOTS = [];
var dot;
var MOVE_DOWN_SPEED = 0;
// var alive = true;
var BUTTON_CLICKED = 0;

var SCORE = 0;
// check local storage
if (typeof window.localStorage["SPACE_BALL_SCORE"] === "undefined") {
  window.localStorage["SPACE_BALL_SCORE"] = SCORE + "";
} else {
  SCORE = parseInt(window.localStorage["SPACE_BALL_SCORE"]);
}

var GAME_OVER = false;
var GAME_START = false;

var PLANET_MAX_RADIUS = WIDTH * 0.2;
var PLANET_MIN_RADIUS = WIDTH * 0.08;

document.body.addEventListener(
  "touchmove",
  function (event) {
    event.preventDefault();
  },
  false
);

//// planet class
function Planet(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.orbit = radius + 12;
  this.w = 35 * Math.sqrt(1 / this.radius);
  this.inside = false;

  this.planet = new createjs.Shape();
  stage.addChild(this.planet);

  this.moveDownSpeed = 1;
  this.type = 0;
  this.used = 0;
  this.max_radius = this.radius * 1.5;
  this.min_radius = this.radius * 0.8;
  this.increasingRadiusRate = 1;

  this.text = new createjs.Text();
  this.text.textAlign = "center";
  this.text.textBaseline = "middle";
  stage.addChild(this.text);

  this.press_count = 0;
  this.explodingTimer = parseInt(6000 + Math.random() * 5000); // 4000 miliseconds
  this.can_be_used = true;
  this.draw = function () {
    // draw planet
    switch (this.type) {
      case 0: // Simple Planet
        this.planet.graphics.beginFill("#ababab").drawCircle(0, 0, this.radius);
        this.planet.x = this.x;
        this.planet.y = this.y;

        this.text.text = "☉";
        this.text.font = "bold 40px Arial";
        this.text.color = "white";
        this.text.x = this.x;
        this.text.y = this.y + 4;
        break;
      case 1: // Slow Down Star
        this.planet.graphics.beginFill("#a3eecd").drawCircle(0, 0, this.radius);
        this.planet.x = this.x;
        this.planet.y = this.y;

        this.text.text = "⬇︎";
        this.text.font = "bold 40px Impact";
        this.text.color = "white";
        this.text.x = this.x;
        this.text.y = this.y;
        break;
      case 2: // Speed Up
        this.planet.graphics.beginFill("#CC6600").drawCircle(0, 0, this.radius);
        this.planet.x = this.x;
        this.planet.y = this.y;

        this.text.text = "⬆︎";
        this.text.font = "bold 40px Impact";
        this.text.color = "white";
        this.text.x = this.x;
        this.text.y = this.y;
        break;
      case 3: //press 10 times to project
        this.press_count = parseInt(11 * Math.random());
        this.planet.graphics.beginFill("#cc9966").drawCircle(0, 0, this.radius);
        this.planet.x = this.x;
        this.planet.y = this.y;

        this.text.text = this.press_count + "";
        this.text.font = "bold 30px Impact";
        this.text.color = "white";
        this.text.x = this.x;
        this.text.y = this.y;
        break;
      case 4: //Exploding Stars. (Lose )
        this.press_count = parseInt(11 * Math.random());
        this.planet.graphics.beginFill("#cc3333").drawCircle(0, 0, this.radius);
        this.planet.x = this.x;
        this.planet.y = this.y;

        // 保存rgb
        this.planet.redOffset = 204;
        this.planet.greenOffset = 51;
        this.planet.blueOffset = 51;

        this.text.text = "✇";
        this.text.font = "bold 40px Impact";
        this.text.color = "white";
        this.text.x = this.x;
        this.text.y = this.y;
        break;
      case 5: //Reproducing Stars
        this.planet.graphics.beginFill("#996699").drawCircle(0, 0, this.radius);
        this.planet.x = this.x;
        this.planet.y = this.y;

        this.used = 0;
        this.text.text = "❤";
        this.text.font = "bold 40px Impact";
        this.text.color = "white";
        this.text.x = this.x;
        this.text.y = this.y;
        break;
      case 6: //The Planet that can change the radius
        this.planet.graphics.beginFill("#666666").drawCircle(0, 0, this.radius);
        this.planet.x = this.x;
        this.planet.y = this.y;
        break;
      default:
        break;
    }
  };
  this.checkInside = function (dot) {
    if (
      dot.x < this.x + this.orbit &&
      dot.x > this.x - this.orbit &&
      dot.y > this.y - this.orbit &&
      dot.y < this.y + this.orbit
    ) {
      return true;
    } else {
      return false;
    }
  };
  this.move_down = function () {
    // planet move down
    this.y += this.moveDownSpeed + MOVE_DOWN_SPEED;
    this.planet.y = this.y;
    // this.planet.animate({cx: this.x, cy:this.y});
    if (this.type === 3) {
      this.text.text = this.press_count + "";
      this.text.x = this.x;
      this.text.y = this.y;
    } else if (this.type === 4) {
      this.text.text = "✇";
      this.text.x = this.x;
      this.text.y = this.y;
    } else if (this.type === 5) {
      this.text.text = "❤";
      this.text.x = this.x;
      this.text.y = this.y;
    } else if (this.type === 2) {
      this.text.text = "⬆︎";
      this.text.x = this.x;
      this.text.y = this.y;
    } else if (this.type === 1) {
      this.text.text = "⬇︎";
      this.text.x = this.x;
      this.text.y = this.y;
    } else if (this.type === 0) {
      this.text.text = "☉";
      this.text.x = this.x;
      this.text.y = this.y + 4;
    }

    if (this.type === 6) {
      if (this.radius >= this.max_radius) {
        this.increasingRadiusRate = -Math.abs(this.increasingRadiusRate);
      }
      if (this.radius <= this.min_radius) {
        this.increasingRadiusRate = Math.abs(this.increasingRadiusRate);
      }
      this.radius = this.radius + this.increasingRadiusRate;
      this.orbit = this.radius + 10;
      // this.planet.radius = this.radius;
      // this.planet.animate({r:this.radius});
      this.planet.graphics.clear(); // remove original circle
      this.planet.graphics.beginFill("#666666").drawCircle(0, 0, this.radius);
      this.planet.x = this.x;
      this.planet.y = this.y;
    }
  };
}

var scorelabel;
var planet1;
var planet2;
var planet3;

document.body.addEventListener("click", function (event) {
  click_event();
});
document.body.addEventListener(
  "touchmove",
  function (event) {
    event.preventDefault();
  },
  false
);
document.body.addEventListener(
  "touchstart",
  function (event) {
    event.preventDefault();
    click_event();
  },
  false
);

document.body.addEventListener("keydown", function (evt) {
  //if(evt.which === 32){ // space
  click_event();
  //}
});
/*

 init game

*/
var init_game = function () {
  stage.removeAllChildren();
  GAME_OVER = false;
  GAME_START = false; // need to click to start
  drawBackground(BACKGROUND_COLOR);
  // reset everything
  COUNT = 0;
  RADIUS_OF_THE_BALL = 10;
  TIME_INTERVAL = 25;

  PLANETS = [];
  PLANETS_START = 0; // clear planets

  DOTS = [];
  BUTTON_CLICKED = 0;
  SCORE = 0;
  MOVE_DOWN_SPEED = 0.5; //0.5;

  scorelabel = new createjs.Text();
  scorelabel.textAlign = "center"; // horizontal
  scorelabel.textBaseline = "middle"; // vertical
  scorelabel.x = 64;
  scorelabel.y = 32;
  scorelabel.text = "分数\n" + parseInt(SCORE);

  scorelabel.font = "bold 30px Impact";
  scorelabel.color = "white";
  stage.addChild(scorelabel);

  planet1 = new Planet(WIDTH / 2, 300, 50);
  planet1.draw();
  PLANETS.push(planet1);

  planet2 = new Planet(WIDTH / 2, 150, 60);
  planet2.type = 4;
  planet2.draw();
  PLANETS.push(planet2);

  planet3 = new Planet(
    planet2.x + Math.random() * 50 + 100,
    -50,
    40 + Math.random() * 10
  );
  planet3.type = parseInt(Math.random() * 7);
  planet3.draw();
  PLANETS.push(planet3);

  dot = new createjs.Shape();
  dot.graphics.beginFill("#e8e8e8").drawCircle(0, 0, RADIUS_OF_THE_BALL);
  dot.leavingPlanet = null;
  dot.orbitingPlanet = planet1;
  dot.status = 0;
  dot.CLOCKWISE = false;
  dot.TIME = 0;
  dot.THETA0 = 0;
  dot.lose = false;
  dot.x = planet1.x;
  dot.y = planet1.y + planet1.orbit;

  stage.addChild(dot);

  DOTS.push(dot); // save dot;

  stage.update();

  SHOW_MENU = false;
};

var click_event = function () {
  if (SHOW_MENU) return;
  if (GAME_OVER == true) {
    DrawMenu();
    return;
  }
  if (GAME_START == false) {
    GAME_START = true;
    scorelabel.x = 64;
    scorelabel.y = 32;
    scorelabel.text = "分数\n" + parseInt(SCORE);
    return;
  }
  for (var i = 0; i < DOTS.length; i++) {
    var dot = DOTS[i];
    if (dot.lose) continue;
    if (dot.orbitingPlanet.type === 3 && dot.orbitingPlanet.press_count > 0) {
      // press 10 times
      dot.orbitingPlanet.press_count--;
      continue;
    }
    if (dot.status !== 1) {
      var x = dot.x - dot.orbitingPlanet.x; // smallx - bigx
      var y = dot.y - dot.orbitingPlanet.y; // smally - bigy
      var theta = Math.atan(y / x);
      dot.V_X =
        Math.sqrt(x * x + y * y) *
        ((dot.orbitingPlanet.w * Math.PI) / 180) *
        Math.sin(theta); //Vy of big in flight
      dot.V_Y =
        -Math.sqrt(x * x + y * y) *
        ((dot.orbitingPlanet.w * Math.PI) / 180) *
        Math.cos(theta); //Vx of small in flight
      dot.status = 1; // flying
      if (dot.CLOCKWISE) {
        if ((x >= 0 && y <= 0) || (x >= 0 && y >= 0)) {
          dot.V_X = -dot.V_X;
          dot.V_Y = -dot.V_Y;
        }
      } else {
        if ((x <= 0 && y >= 0) || (x <= 0 && y <= 0)) {
          dot.V_X = -dot.V_X;
          dot.V_Y = -dot.V_Y;
        }
      }
      dot.leavingPlanet = dot.orbitingPlanet;
    }
  }
};

var game_is_over = function () {
  scorelabel.x = WIDTH / 2;
  scorelabel.y = HEIGHT * 0.3;
  scorelabel.text = "分数\n" + parseInt(SCORE) + "\n\n点击屏幕继续";
  scorelabel.font = "Bold 40px Impact";
  scorelabel.textAlign = "center"; // horizontal
  scorelabel.textBaseline = "middle"; // vertical
  GAME_START = false;

  if (SCORE > parseInt(window.localStorage["SPACE_BALL_SCORE"])) {
    window.localStorage["SPACE_BALL_SCORE"] = SCORE + "";
  }
};
/*
    generate new planet randomly
*/
var generate_new_planet = function () {
  var x = Math.random() * WIDTH;
  var r = PLANET_MAX_RADIUS * Math.random();
  r = r < PLANET_MIN_RADIUS ? PLANET_MIN_RADIUS : r;

  if (x - r < 0) x = x + r;
  if (x + r > WIDTH) x = x - r;

  var planet = new Planet(x, 0, r);
  if (Math.random() < 0.7) {
    // draw explode and normal 0 and 4
    if (Math.random() + MOVE_DOWN_SPEED / 10 > 0.6) planet.type = 4;
    else planet.type = 0;
  } else {
    // draw 1 2 3 5 6
    planet.type = parseInt(Math.random() * 7);
  }
  planet.used = 0;
  planet.draw();
  PLANETS.push(planet);
};

var DrawMenu = function () {
  SHOW_MENU = true;
  stage.removeAllChildren();
  //document.body.removeEventListener("click", click_keyboard_handler, false)
  //document.body.removeEventListener('touchmove', click_keyboard_handler, false);
  //document.body.removeEventListener('touchstart', click_keyboard_handler, false);
  //document.body.removeEventListener('keydown', click_keyboard_handler, false);

  drawBackground("#454545");

  var button_width = WIDTH * 0.4;
  var button_height = HEIGHT * 0.1;

  // draw score label
  scorelabel = new createjs.Text();
  scorelabel.textAlign = "center"; // horizontal
  scorelabel.textBaseline = "middle"; // vertical
  scorelabel.text =
    "最高分 " +
    parseInt(window.localStorage["SPACE_BALL_SCORE"]) +
    "\n\n点击 右上角按钮\n\n分享到朋友圈 ;)\n";
  scorelabel.x = WIDTH * 0.5;
  scorelabel.y = HEIGHT * 0.3;
  scorelabel.font = "bold 24px Impact";
  scorelabel.color = "white";
  stage.addChild(scorelabel);

  var startGameButton = new createjs.Shape();
  var startGameButtonText = new createjs.Text();
  startGameButton.graphics
    .beginFill("#3f97f2")
    .drawRect(0, 0, button_width, button_height);
  startGameButton.x = WIDTH * 0.3;
  startGameButton.y = HEIGHT * 0.6;
  startGameButton.addEventListener("click", function () {
    init_game();
  });

  stage.addChild(startGameButton);

  startGameButtonText.textAlign = "center";
  startGameButtonText.textBaseline = "middle";
  startGameButtonText.text = "开始游戏";
  startGameButtonText.font = "bold 20px Impact";
  startGameButtonText.color = "white";
  startGameButtonText.x = startGameButton.x + button_width / 2;
  startGameButtonText.y = startGameButton.y + button_height / 2;
  stage.addChild(startGameButtonText);

  var version = new createjs.Text();
  version.textAlign = "center";
  version.textBaseline = "middle";
  version.text = "0xGG\n版本: build " + GAME_VERSION;
  // + "\nBy Yiyi, Aya, Sophia, Aaron.";
  version.font = "bold 20 Impact";
  version.color = "white";
  version.y = HEIGHT * 0.8;
  version.x = WIDTH * 0.5;
  stage.addChild(version);

  document.title =
    "哈哈我的分数是 " +
    parseInt(window.localStorage["SPACE_BALL_SCORE"]) +
    "\n快来击败我啊 ~(*_*)~\n";
  微信分享的内容 = document.title;

  stage.update();
};

/*
 *
 *     Show Walley Soft. 0xGG Game Studio
 *
 */
drawBackground("#18668e");
var Brand = new createjs.Text();
Brand.textAlign = "center";
Brand.textBaseline = "middle";
Brand.text = "Walley Soft\n\n0xGG Game Studio";
Brand.font = "bold 40px Impact";
Brand.color = "white";
Brand.x = WIDTH * 0.5;
Brand.y = HEIGHT * 0.4;
stage.addChild(Brand);
stage.update();

setTimeout(function () {
  // init_game(); // init game
  DrawMenu();
}, 1);

function tick() {
  if (GAME_START === false) return;
  // MOVE_DOWN_SPEED += 0.02*parseInt(SCORE/100);
  if (MOVE_DOWN_SPEED > 3.0) {
    MOVE_DOWN_SPEED = 3.0;
  } else {
    MOVE_DOWN_SPEED += 0.0003;
  }
  if (!GAME_OVER) SCORE += 0.01;
  COUNT = COUNT + MOVE_DOWN_SPEED;
  if (COUNT > 80 + MOVE_DOWN_SPEED * 30) {
    COUNT = 0;
    generate_new_planet();
  }
  // show score
  scorelabel.text = "分数\n" + parseInt(SCORE);

  //if(BUTTON_CLICKED) return;
  for (var i = PLANETS_START; i < PLANETS.length; i++) {
    // move each planet down
    var p = PLANETS[i];
    if (p === null) continue;
    if (p.can_be_used === false) {
      PLANETS[i].planet.graphics.clear();
      stage.removeChild(PLANETS[i].text);
      PLANETS[i] = null;
      // PLANETS_START = i;
      continue;
    }
    p.move_down(); // move down
    if (p.planet.y >= HEIGHT + 200) {
      // p.can_be_used = false;
      PLANETS[i].planet.graphics.clear();
      stage.removeChild(PLANETS[i].text);
      PLANETS[i] = null;
      PLANETS_START = i;
      continue;
    } // too low
    if (p.type === 4 && p.used === 1) {
      // check explosion
      //if (p.explodingTimer <= 2000 + TIME_INTERVAL/2 && p.explodingTimer >= 2000 - TIME_INTERVAL/2 ){ // 为了保证肯定能跳
      //    generate_new_planet();
      //}

      p.explodingTimer -= TIME_INTERVAL;
      if (p.explodingTimer < 0) {
        var save_ = p;
        /*
                    rgb(204, 51, 51)
                    到 rgb(247, 210, 7)
                    
                    47 / 100
                    160 / 100
                    -44 / 100
                */
        if (p.explodingTimer >= -1500) {
          save_.planet.redOffset = parseInt(save_.planet.redOffset + 1);
          save_.planet.greenOffset = parseInt(save_.planet.greenOffset + 1);
          save_.planet.blueOffset = parseInt(save_.planet.blueOffset - 1);
          var r = save_.planet.redOffset;
          var g = save_.planet.greenOffset;
          var b = save_.planet.blueOffset;
          save_.text.text = "Boom";
          save_.planet.graphics.clear();
          save_.planet.graphics.beginFill(createjs.Graphics.getRGB(r, g, b));
          save_.planet.graphics.drawCircle(0, 0, save_.radius);
          save_.planet.x = save_.x;
          save_.planet.y = save_.y;
          save_.radius += 0.5;
        } else {
          p.can_be_used = false;
        }
        for (var j = 0; j < DOTS.length; j++) {
          if (DOTS[j].status === 1) continue;
          if (DOTS[j].lose) continue;
          if (DOTS[j].orbitingPlanet === PLANETS[i]) {
            DOTS[j].lose = true;
            DOTS[j].y = HEIGHT + 400;
          }
        }
      } else {
        p.text.text = parseInt(PLANETS[i].explodingTimer / 1000) + "";
      }
    }
  }
  GAME_OVER = true;
  var dot;
  var LENGTH = DOTS.length;
  for (var i = 0; i < LENGTH; i++) {
    dot = DOTS[i];
    dot.TIME += TIME_INTERVAL;

    if (dot.lose) continue;

    if (
      dot.y > HEIGHT + 100 ||
      dot.x <= 0 - 100 ||
      dot.x >= WIDTH + 100 ||
      dot.y <= 0 - 100
    ) {
      dot.lose = true;
      continue;
    } else {
      GAME_OVER = false;
    }

    if (dot.status == 0) {
      // orbiting
      var theta = dot.THETA0;
      if (dot.CLOCKWISE)
        theta = theta + (dot.orbitingPlanet.w * dot.TIME) / 1000;
      else theta = theta - (dot.orbitingPlanet.w * dot.TIME) / 1000;

      var x = dot.orbitingPlanet.orbit * Math.cos(theta) + dot.orbitingPlanet.x;
      var y = dot.orbitingPlanet.orbit * Math.sin(theta) + dot.orbitingPlanet.y;
      // dot.animate({cx:x, cy:y});
      dot.x = x;
      dot.y = y;
    } else {
      // flying
      //console.log("FLYING X: " + dot.attr("cx") + " Y: " + dot.attr("cy"));
      for (var j = PLANETS_START; j < PLANETS.length; j++) {
        var p = PLANETS[j];
        if (p === null) continue;
        if (p.can_be_used === false) continue;
        if (p.y >= HEIGHT) continue;
        if (p === dot.leavingPlanet) continue;
        if (p.checkInside(dot)) {
          // meets planet
          dot.orbitingPlanet = p;
          switch (p.type) {
            case 0: // simple
              SCORE += 5;
              break;
            case 1: // slow down planet
              if (p.used == 0 && MOVE_DOWN_SPEED >= -0.5) {
                MOVE_DOWN_SPEED -= 0.25;
                p.used = 1;
                SCORE += 10;
              }
              break;
            case 2: // speed up planet
              if (p.used == 0 && MOVE_DOWN_SPEED <= 0.5) {
                MOVE_DOWN_SPEED += 0.25;
                p.used = 1;
                SCORE += 20;
              }
              break;
            case 3: // press 10 times
              if (p.used == 0) {
                p.used = 1;
                SCORE += 20;
                // p.press_count = 10;
              }
              break;
            case 4: // exploding
              //game_is_over();
              SCORE += 5;
              p.used = 1;
              break;
            case 5: // reproducing planet
              SCORE += 20;
              if (p.used === 0) {
                for (var a_ = 0; a_ < 5; a_++) {
                  // create 5 new dots
                  var ran = Math.random() - 0.5;

                  var newDot = new createjs.Shape();
                  newDot.graphics
                    .beginFill("#e8e8e8")
                    .drawCircle(0, 0, RADIUS_OF_THE_BALL);
                  newDot.leavingPlanet = dot.leavingPlanet;
                  newDot.orbitingPlanet = dot.orbitingPlanet;
                  newDot.status = 0;
                  newDot.CLOCKWISE = Math.random() > 0.5 ? true : false;
                  newDot.TIME = 0;
                  newDot.THETA0 = ran;
                  newDot.lose = false;
                  newDot.x =
                    dot.orbitingPlanet.x +
                    dot.orbitingPlanet.orbit * Math.cos(ran);
                  newDot.y =
                    dot.orbitingPlanet.y +
                    dot.orbitingPlanet.orbit * Math.sin(ran);

                  stage.addChild(newDot);

                  DOTS.push(newDot); // save that dot
                }
                p.used = 1;
              }
              break;
            case 6: // radius changing star
              break;
            default:
              break;
          }
          dot.status = 0; // set status
          dot.TIME = 0; // clear time

          if (dot.V_X > 0) {
            if (dot.y - dot.orbitingPlanet.y > 0) {
              if (Math.abs(dot.V_X / dot.V_Y) < 1) dot.CLOCKWISE = false;
              else dot.CLOCKWISE = true;
            } else dot.CLOCKWISE = true;
          } else {
            if (dot.y - dot.orbitingPlanet.y > 0) {
              if (Math.abs(dot.V_X / dot.V_Y) < 1) dot.CLOCKWISE = true;
              else dot.CLOCKWISE = false;
            } else dot.CLOCKWISE = false;
          }
          if (dot.x - dot.orbitingPlanet.x >= 0)
            dot.THETA0 = Math.atan(
              (dot.y - dot.orbitingPlanet.y) / (dot.x - dot.orbitingPlanet.x)
            );
          else
            dot.THETA0 =
              Math.atan(
                (dot.y - dot.orbitingPlanet.y) / (dot.x - dot.orbitingPlanet.x)
              ) + Math.PI;

          break;
        }
      }
      if (dot.status !== 0) {
        // flying
        dot.x += dot.V_X * 1.2;
        dot.y += dot.V_Y * 1.2;
      }
    }
  }
  if (GAME_OVER) {
    // game over
    scorelabel.text =
      "Press Space or Click or Touch Screen to Start\nScore\n" +
      parseInt(SCORE);
    scorelabel.font = "bold 30px";
    game_is_over();
  }
  stage.update();
}

/*
 *
 * 微信朋友圈设置
 *
 */
/*
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
                // 发送给好友
                WeixinJSBridge.on('menu:share:appmessage', function (argv) {
                    WeixinJSBridge.invoke('sendAppMessage', {
                        "appid": "",
                        "img_url": "http://planetwalley.com/space_ball/图标.png",
                        "img_width": "300",
                        "img_height": "300",
                        "link": "http://planetwalley.com/space_ball/",
                        "desc":  "Space Ball",
                        "title": document.title
                    }, function (res) {
                        _report('send_msg', res.err_msg);
                    })
                });

                // 分享到朋友圈
                WeixinJSBridge.on('menu:share:timeline', function (argv) {
                    WeixinJSBridge.invoke('shareTimeline', {
                        "img_url": "http://planetwalley.com/space_ball/图标.png",
                        "img_width": "300",
                        "img_height": "300",
                        "link": "http://planetwalley.com/space_ball/",
                        "desc":  "Space Ball",
                        "title": document.title
                    }, function (res) {
                        _report('timeline', res.err_msg);
                    });
                });
            }, false)
*/

createjs.Ticker.addEventListener("tick", tick);
// these are equivalent, 1000ms / 40fps = 25ms
createjs.Ticker.setInterval(25);
createjs.Ticker.setFPS(40);
