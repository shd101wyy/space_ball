
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

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var canvas = document.getElementById("game_canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;

var stage = new createjs.Stage("game_canvas");


var BACKGROUND_COLOR = "#454545";
/*
    draw background
*/
function drawBackground(bg_color){
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
var TIME_INTERVAL = 30;
var PLANETS = [];
var PLANETS_START = 0;
var DOTS = [];
var dot;
var MOVE_DOWN_SPEED = 0;
// var alive = true;
var BUTTON_CLICKED = 0;
var SCORE = 0;
var GAME_OVER = false;
var GAME_START = false;

var PLANET_MAX_RADIUS = WIDTH * 0.1;
var PLANET_MIN_RADIUS = WIDTH * 0.04;


document.body.addEventListener('touchmove', function(event) {
  event.preventDefault();
}, false); 

//// planet class
function Planet(x, y, radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.orbit = radius + 20;
    this.w = 35*Math.sqrt(1/this.radius);
    this.inside = false;
    //this.planet = paper.circle(this.x,this.y,this.radius);

    this.planet = new createjs.Shape();
    stage.addChild(this.planet);
    
    this.move_down_speed = 1;
    this.type = 0;
    this.used = 0;
    this.max_radius = this.radius * 1.5;
    this.min_radius = this.radius*0.8;
    this.increasing_radius_rate = 2;
    
    this.text = new createjs.Text();
    this.text.textAlign = "center";
    stage.addChild(this.text);
    
    this.press_count = 0;
    this.exploding_timer = 4000 + Math.random() * 6000; // 4000 miliseconds
    this.can_be_used = true;
    this.draw = function(){
        // draw planet
        switch (this.type) {
            case 0: // Simple Planet
                this.planet.graphics.beginFill("#ababab").drawCircle(0, 0, this.radius);
                this.planet.x = this.x;
                this.planet.y = this.y
                
                this.text.text = "࿂";
                this.text.font = "Bold 40 Arial";
                this.text.color = "white";
                this.text.x = this.x;
                this.text.y = this.y;
                break;
            case 1: // Slow Down Star
                this.planet.graphics.beginFill("#a3eecd").drawCircle(0, 0, this.radius);
                this.planet.x = this.x;
                this.planet.y = this.y
                
                this.text.text = "⟱";
                this.text.font = "bold 40 Impact";
                this.text.color = "white";  
                this.text.x = this.x;
                this.text.y = this.y;
                break;
            case 2: // Speed Up
                this.planet.graphics.beginFill("#CC6600").drawCircle(0, 0, this.radius);
                this.planet.x = this.x;
                this.planet.y = this.y
                
                this.text.text = "⟰";
                this.text.font = "bold 40 Impact";
                this.text.color = "white";
                this.text.x = this.x;
                this.text.y = this.y;               
                break;
            case 3: //press 10 times to project
                this.press_count = parseInt(11 * Math.random());
                this.planet.graphics.beginFill("#cc9966").drawCircle(0, 0, this.radius);
                this.planet.x = this.x;
                this.planet.y = this.y
                
                this.text.text = this.press_count+"";
                this.text.font = "bold 30 Impact";
                this.text.color = "white";
                this.text.x = this.x;
                this.text.y = this.y;               
                break;
            case 4: //Exploding Stars. (Lose )
                this.press_count = parseInt(11 * Math.random());
                this.planet.graphics.beginFill("#cc3333").drawCircle(0, 0, this.radius);
                this.planet.x = this.x;
                this.planet.y = this.y
                
                this.text.text = "✇";
                this.text.font = "bold 40 Impact";
                this.text.color = "white";
                this.text.x = this.x;
                this.text.y = this.y;               
                break;
            case 5: //Reproducing Stars
                this.planet.graphics.beginFill("#996699").drawCircle(0, 0, this.radius);
                this.planet.x = this.x;
                this.planet.y = this.y
                
                this.used = 0;
                this.text.text = "❤";
                this.text.font = "bold 40 Impact";
                this.text.color = "white";
                this.text.x = this.x;
                this.text.y = this.y;               
                break;
            case 6: //The Planet that can change the radius
                this.planet.graphics.beginFill("#666666").drawCircle(0, 0, this.radius);
                this.planet.x = this.x;
                this.planet.y = this.y
                break;
            default:
                break;
        }
    }  
    this.checkInside = function(dot){
            if( (dot.x < this.x + this.orbit && dot.x > this.x - this.orbit) && 
                (dot.y > this.y - this.orbit && dot.y < this.y + this.orbit) ){
                return true;
            }
            else{
                return false;
            }
    }
    this.move_down = function(){ // planet move down
        this.y += (this.move_down_speed + MOVE_DOWN_SPEED);
        this.planet.y = this.y;
        // this.planet.animate({cx: this.x, cy:this.y});
        if(this.type === 3){
            this.text.text = this.press_count + "";
            this.text.x = this.x;
            this.text.y = this.y;
        }
        else if(this.type === 4){
            this.text.text = "✇";
            this.text.x = this.x;
            this.text.y = this.y;            
        }
        else if(this.type === 5){
            this.text.text = "❤";
            this.text.x = this.x;
            this.text.y = this.y;   
        }
        else if (this.type === 2){
            this.text.text = "⟰";
            this.text.x = this.x;
            this.text.y = this.y;   
        }
        else if (this.type === 1){
            this.text.text = "⟱";
            this.text.x = this.x;
            this.text.y = this.y;              
        }
        else if (this.type === 0){
            this.text.text = "࿂";
            this.text.x = this.x;
            this.text.y = this.y;             
        }

        if(this.type === 6){
            if(this.radius >= this.max_radius){
                this.increasing_radius_rate = -Math.abs(this.increasing_radius_rate);
            }
            if(this.radius <= this.min_radius){
                this.increasing_radius_rate = Math.abs(this.increasing_radius_rate);
            }
            this.radius = this.radius + this.increasing_radius_rate;
            this.orbit = this.radius + 10;
            // this.planet.radius = this.radius;
            // this.planet.animate({r:this.radius});
            this.planet.graphics.clear(); // remove original circle
            this.planet.graphics.beginFill("#666666").drawCircle(0, 0, this.radius);
            this.planet.x = this.x;
            this.planet.y = this.y
        }
    }
}

var scorelabel;
var planet1;
var planet2;
var planet3;


/*

 init game

*/
var init_game = function(){
    stage.removeAllChildren();
    GAME_OVER = false;
    GAME_START = false; // need to click to start
    drawBackground(BACKGROUND_COLOR);
    // reset everything
    COUNT = 0;
    RADIUS_OF_THE_BALL = 10;
    TIME_INTERVAL = 30;

    PLANETS = [];
    PLANETS_START = 0; // clear planets

    DOTS = [];        
    BUTTON_CLICKED = 0;
    SCORE = 0;
    MOVE_DOWN_SPEED = 0.5;//0.5;
    
    scorelabel = new createjs.Text();
    scorelabel.textAlign = "center";
    scorelabel.text = "Press Space or Click or Touch Screen to Start\nScore\n"+parseInt(SCORE);
    scorelabel.x = WIDTH / 2;
    scorelabel.y = HEIGHT / 2 + 50;
    scorelabel.font = "Bold 40 Impact";
    scorelabel.color = "white";
    stage.addChild(scorelabel);
        
    planet1 = new Planet(320,300,50);
    // planet1 = new Planet(50,50,100);
    planet1.draw();
    
    planet2 = new Planet(360, 150, 60);
    planet2.type = 4;
    planet2.draw();

    planet3 = new Planet(planet2.x+Math.random()*50+100,
                     -50,30+Math.random()*60, 120);
    planet3.type = parseInt(Math.random() * 7);
    planet3.draw();

    PLANETS.push(planet1);
    PLANETS.push(planet2);
    PLANETS.push(planet3);

    dot = new createjs.Shape()
    dot.graphics.beginFill("#e8e8e8").drawCircle(0, 0, RADIUS_OF_THE_BALL);
    dot.leaving_planet = null;
    dot.orbiting_planet = planet1;
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
    
    
    console.log(dot.x + " " + dot.y);
    
}


var click_event = function(){  
    if(GAME_OVER){
        init_game();
        GAME_START = true;
        
        scorelabel.x = 100;
        scorelabel.y = 100;
        scorelabel.text = "Score\n" + parseInt(SCORE);
        return;
    }
    if(GAME_START === false){
        GAME_START = true;
        scorelabel.x = 100;
        scorelabel.y = 100;
        scorelabel.text = "Score\n" + parseInt(SCORE);
        return;
    }
    for(var i = 0; i < DOTS.length; i++){
        var dot = DOTS[i];
        if(dot.lose) continue;
        if(dot.orbiting_planet.type === 3 && dot.orbiting_planet.press_count > 0){ // press 10 times
            dot.orbiting_planet.press_count--;
            continue;
        }
        if(dot.status!== 1){
            var x = (dot.x - dot.orbiting_planet.x); // smallx - bigx
            var y = (dot.y - dot.orbiting_planet.y); // smally - bigy
            var theta = Math.atan(y/x);
            dot.V_X = Math.sqrt(x * x + y * y) * (dot.orbiting_planet.w*Math.PI/180) * Math.sin(theta);   //Vy of big in flight
            dot.V_Y = -Math.sqrt(x * x + y * y) * (dot.orbiting_planet.w*Math.PI/180 ) * Math.cos(theta);   //Vx of small in flight
            dot.status = 1; // flying
            if(dot.CLOCKWISE){
                 if((x >=0 && y <=0) || (x >= 0 && y >= 0)){
                     dot.V_X = -dot.V_X 
                     dot.V_Y = -dot.V_Y;
                 }
             }
             else{
                 if((x <=0 && y >=0) || (x <= 0 && y <= 0)){
                     dot.V_X = -dot.V_X 
                     dot.V_Y = -dot.V_Y;
                 }
             }
             dot.leaving_planet = dot.orbiting_planet;
        }
    }
}
document.body.addEventListener("click", function(event){
    click_event();
})
document.body.addEventListener('touchmove', function(event) {
  event.preventDefault();
}, false); 
document.body.addEventListener('touchstart', function(event) {
  event.preventDefault();
  click_event();
}, false); 

document.body.addEventListener('keydown', function(evt){
    if(evt.which === 32){ // space
        click_event();
    }             
});

var game_is_over = function(){
    scorelabel.x = WIDTH / 2;
    scorelabel.y = HEIGHT / 2;
    scorelabel.text = "Score\n" + parseInt(SCORE);
    scorelabel.font = "Bold 80 Impact";    
    // alert("GAME OVER");
}
/*
    generate new planet randomly
*/
var generate_new_planet = function(){
    var x = Math.random() * WIDTH;
    var r = PLANET_MAX_RADIUS * Math.random();
    r = r < PLANET_MIN_RADIUS ? PLANET_MIN_RADIUS : r;

    if(x - r < 0) x = x + r;
    if(x + r > WIDTH) x = x - r;
    

    var planet = new Planet(x, 0, r);
    if (Math.random() < 0.7) { // draw explode and normal 0 and 4  
        if (Math.random() + MOVE_DOWN_SPEED / 10 > 0.6)
            planet.type = 4;
        else
            planet.type = 0;
    }
    else{ // draw 1 2 3 5 6
        planet.type = parseInt(Math.random()*7);
    }
    planet.used = 0;
    planet.draw();
    PLANETS.push(planet);
}

init_game(); // init game



function tick(){
    if(GAME_START === false) return;
    MOVE_DOWN_SPEED += 0.02*parseInt(SCORE/100);
    if(MOVE_DOWN_SPEED > 3.0){
        MOVE_DOWN_SPEED = 3.0;
    }
    if(!GAME_OVER)
        SCORE += 0.01;
    COUNT = COUNT + MOVE_DOWN_SPEED;
    if(COUNT > 80 + (MOVE_DOWN_SPEED) * 30){
        COUNT = 0;
        generate_new_planet();
    }
    // show score
    scorelabel.text = "Score\n" + parseInt(SCORE);
    
    //if(BUTTON_CLICKED) return;
    for(var i = PLANETS_START; i < PLANETS.length; i++){ // move each planet down
        var p = PLANETS[i];
        if(p === null) continue;
        if(p.can_be_used === false) {
            PLANETS[i].planet.graphics.clear();
            stage.removeChild(PLANETS[i].text);
            PLANETS[i] = null;
            // PLANETS_START = i;
            continue;
        }
        p.move_down(); // move down
        if(p.planet.y >= HEIGHT + 200){
            // p.can_be_used = false; 
            PLANETS[i].planet.graphics.clear();
            stage.removeChild(PLANETS[i].text);
            PLANETS[i] = null;
            PLANETS_START = i;
            continue;
        } // too low
        if( p.type === 4 && p.used === 1) { // check explosion
            if(p.exploding_timer == 2){ // 为了保证肯定能跳
                generate_new_planet(); 
            }
            
            p.exploding_timer -= TIME_INTERVAL;
            if(p.exploding_timer < 0){
                var save_ = p;
                p.can_be_used = false;
                /*
                save_.planet.animate({fill: "#fffe33", r: p.radius + 30}, 1000, function(){
                    save_.planet.animate({fill: BACKGROUND_COLOR, r: 0}, 1000); // explosion effect
                    save_.text.attr({text: "Boom!!!"})
                    save_.text.animate({fill: BACKGROUND_COLOR}, 1000, function(){
                        save_.text.animate({y:HEIGHT + 200}); // clear text and planet
                        save_.planet.animate({cy:HEIGHT + 200});
                    });
                })
                */
                // save_.beginFill("yellow");
                for(var j = 0; j < DOTS.length; j++){
                    if(DOTS[j].status === 1) continue;
                    if(DOTS[j].lose) continue;
                    if(DOTS[j].orbiting_planet === PLANETS[i]){
                        DOTS[j].lose = true;
                        DOTS[j].y = HEIGHT + 400;
                    }
                }
            }
            else{
                p.text.text = parseInt(PLANETS[i].exploding_timer/1000)+""
            }
        }
    }
    GAME_OVER = true;
    var dot;
    var LENGTH = DOTS.length;
    for(var i = 0; i < LENGTH; i++){
        dot = DOTS[i];
        dot.TIME += TIME_INTERVAL;
        
        if(dot.lose) continue;
        
        if(dot.y > HEIGHT + 100 || dot.x <= 0 - 100 || dot.x >= WIDTH + 100 || dot.y <= 0 - 100){
            dot.lose = true;
            continue;
        }
        else{
            GAME_OVER = false;
        }
        
        if(dot.status == 0){ // orbiting
            var theta = dot.THETA0;
            if (dot.CLOCKWISE) theta = theta + dot.orbiting_planet.w * dot.TIME/1000;
            else theta = theta - dot.orbiting_planet.w * dot.TIME/1000;
            
            var x = dot.orbiting_planet.orbit * Math.cos(theta) + dot.orbiting_planet.x;
            var y = dot.orbiting_planet.orbit * Math.sin(theta) + dot.orbiting_planet.y;
            // dot.animate({cx:x, cy:y});
            dot.x = x;
            dot.y = y;
        }
        else{ // flying
            //console.log("FLYING X: " + dot.attr("cx") + " Y: " + dot.attr("cy"));
            for(var j = PLANETS_START; j < PLANETS.length; j++){
                var p = PLANETS[j];
                if(p === null) continue;
                if(p.can_be_used === false) continue;
                if(p.y >= HEIGHT) continue;
                if(p === dot.leaving_planet) continue;
                if(p.checkInside(dot)){ // meets planet
                    dot.orbiting_planet = p;
                    switch (p.type) {
                        case 0: // simple
                            SCORE += 5;
                            break;
                        case 1: // slow down planet
                            if(p.used == 0 && MOVE_DOWN_SPEED >= -0.5){
                                MOVE_DOWN_SPEED -= 0.25;
                                p.used = 1;
                                SCORE += 10;
                            }
                            break;
                        case 2: // speed up planet
                            if(p.used == 0 && MOVE_DOWN_SPEED <= 0.5){
                                MOVE_DOWN_SPEED += 0.25;
                                p.used = 1;
                                SCORE += 20;
                            }
                            break;
                        case 3: // press 10 times
                            if(p.used == 0){
                                p.used = 1;
                                SCORE += 20;
                                // p.press_count = 10;
                            }
                            break
                        case 4: // exploding
                            //game_is_over();
                            p.used = 1;
                            break;
                        case 5: // reproducing planet
                            SCORE+= 20;
                            if(p.used === 0){
                                for(var a_ = 0; a_ < 5; a_++){ // create 5 new dots
                                    var ran = Math.random() - 0.5;
                                    
                                    var new_dot = new createjs.Shape()
                                    new_dot.graphics.beginFill("#e8e8e8").drawCircle(0, 0, RADIUS_OF_THE_BALL);
                                    new_dot.leaving_planet = dot.leaving_planet;
                                    new_dot.orbiting_planet = dot.orbiting_planet;
                                    new_dot.status = 0;
                                    new_dot.CLOCKWISE = Math.random() > 0.5? dot.CLOCKWISE : -dot.CLOCKWISE;;
                                    new_dot.TIME = 0;
                                    new_dot.THETA0 = ran;
                                    new_dot.lose = false;
                                    new_dot.x = dot.orbiting_planet.x + (dot.orbiting_planet.orbit)*Math.cos(ran);
                                    new_dot.y = dot.orbiting_planet.y + (dot.orbiting_planet.orbit)*Math.sin(ran);

                                    stage.addChild(new_dot);
                                    
                                    DOTS.push(new_dot); // save that dot
                                    
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
                    
                   
                    if(dot.V_X > 0){ 
                        if(dot.y - dot.orbiting_planet.y > 0){
                           if(Math.abs(dot.V_X/dot.V_Y)<1)
                               dot.CLOCKWISE = false;
                           else
                               dot.CLOCKWISE = true;}
                        else 
                               dot.CLOCKWISE = true;
                          
                    }
                    else{
                        if(dot.y - dot.orbiting_planet.y > 0){
                           if(Math.abs(dot.V_X/dot.V_Y) <1)
                                dot.CLOCKWISE = true;
                            else 
                            dot.CLOCKWISE = false;}
                        else 
                            dot.CLOCKWISE = false;
                            
                    }
                    if(dot.x - dot.orbiting_planet.x >= 0)
                        dot.THETA0 = Math.atan((dot.y - dot.orbiting_planet.y)
                                       /(dot.x - dot.orbiting_planet.x))
                    else 
                        dot.THETA0 = Math.atan((dot.y - dot.orbiting_planet.y)
                                       /(dot.x - dot.orbiting_planet.x)) + Math.PI;
                    
                    break;
                }
            }
            if(dot.status !== 0){ // flying
                dot.x += dot.V_X * 1.2;
                dot.y += dot.V_Y * 1.2
            }
        }
    }
    if(GAME_OVER) // game over
    {
        scorelabel.text = "Press Space or Click or Touch Screen to Start\nScore\n"+parseInt(SCORE);
        scorelabel.font = "bold 40px";
        game_is_over();
    }
    stage.update();
}

createjs.Ticker.addEventListener("tick", tick);
// these are equivalent, 1000ms / 40fps = 25ms
createjs.Ticker.setInterval(25);
createjs.Ticker.setFPS(40);

    
    
    

