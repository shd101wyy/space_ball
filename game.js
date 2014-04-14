
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
    
*/
var COUNT = 0;
var RADIUS_OF_THE_BALL = 10;
var TIME_INTERVAL = 30;
var PLANETS = [];
var DOTS = [];
var dot;
var HEIGHT = 960;
var WIDTH = 1024;
var MOVE_DOWN_SPEED = 0;
// var alive = true;
var BUTTON_CLICKED = 0;
var SCORE = 0;
var paper = Raphael (0,0,WIDTH,HEIGHT);
var background = paper.rect(0,0,WIDTH,HEIGHT);
var BACKGROUND_COLOR = "#000";
var GAME_OVER = false;
background.attr("fill", BACKGROUND_COLOR);

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
    this.planet = paper.circle(this.x,this.y,this.radius);
    this.move_down_speed = 1;
    this.type = 0;
    this.used = 0;
    this.max_radius = this.radius * 1.5;
    this.min_radius = this.radius*0.8;
    this.increasing_radius_rate = 2;
    this.text = "";
    this.press_count = 0;
    this.exploding_timer = 4000; // 4000 miliseconds
    this.can_be_used = true;
    this.draw = function(){
        // draw planet
        switch (this.type) {
            case 0: // Simple Planet
                this.planet.attr("fill", "#aaa");
                this.planet.attr("stroke", "#aaa");
                this.text = paper.text(this.x, this.y, "࿂").attr({"fill" : "white", "font-size": 60 });
                break;
            case 1: // Slow Down Star
                this.planet.attr("fill", "#a3eecd");
                this.planet.attr("stroke", "#a3eecd");
                this.text = paper.text(this.x, this.y, "⟱").attr({"fill" : "white", "font-size": 40 });
                break;
            case 2: // Speed Up
                this.planet.attr("fill", "#CC6600");
                this.planet.attr("stroke", "#CC6600");
                this.text = paper.text(this.x, this.y, "⟰").attr({"fill" : "white", "font-size": 40 });
                break;
            case 3: //press 10 times to project
                this.press_count = 10;
                this.planet.attr("fill", "#cc9966");
                this.planet.attr("stroke", "#cc9966");
                this.text = paper.text(this.x, this.y, "10").attr({"fill" : "white", "font-size": 30 });
                break;
            case 4: //Exploding Stars. (Lose )
                this.planet.attr("fill", "#cc3333");
                this.planet.attr("stroke", "#cc3333");
                this.text = paper.text(this.x, this.y, "✇").attr({"fill" : "white", "font-size": 40 });
                break;
            case 5: //Reproducing Stars
                this.planet.attr("fill", "#996699");
                this.planet.attr("stroke", "#996699");
                this.used = 0;
                this.text = paper.text(this.x, this.y, "❤").attr({"fill" : "white", "font-size": 40 });
                break;
            case 6: //The Planet that can change the radius
                this.planet.attr("fill", "#666666");
                this.planet.attr("stroke", "#666666");
                break;
            default:
                break;
        }
    }  
    this.checkInside = function(dot){
            if( (dot.attr("cx") < this.x + this.orbit && dot.attr("cx") > this.x - this.orbit) && 
                (dot.attr("cy") > this.y - this.orbit && dot.attr("cy") < this.y + this.orbit) )
            {
                return true;
            }
            else{
                return false;
            }
    }
    this.move_down = function(){ // planet move down
        this.y += (this.move_down_speed + MOVE_DOWN_SPEED) ;
        this.planet.animate({cx: this.x, cy:this.y});
        if(this.type === 3)
            this.text.attr({x: this.x, y:this.y, text: this.press_count + ""})
        else if(this.type === 4)
            this.text.attr({x: this.x, y:this.y, text: "✇"});
        else if(this.type === 5)
            this.text.attr({x: this.x, y:this.y, text: "❤"});
        else if (this.type === 2)
            this.text.attr({x: this.x, y:this.y, text: "⟰"});
        else if (this.type === 1)
            this.text.attr({x: this.x, y:this.y, text: "⟱"});
        else if (this.type === 0)
            this.text.attr({x: this.x, y:this.y, text: "࿂"});

        if(this.type === 6){
            if(this.radius >= this.max_radius){
                this.increasing_radius_rate = -Math.abs(this.increasing_radius_rate);
            }
            if(this.radius <= this.min_radius){
                this.increasing_radius_rate = Math.abs(this.increasing_radius_rate);
            }
            this.radius = this.radius + this.increasing_radius_rate;
            this.orbit = this.radius + 10;
            this.planet.animate({r:this.radius});
        }
    }
}

/*while(alive){
    var planet = new Planet(( Math.random()-0.5)*100+100,
                              0, 30+Math.random()*60, 120);
    planet.type=Math.random()*5+1;
    planet.draw();
    PLANETS.push(planet);
     
}
*/
var scorelabel = paper.text(100,100,"Score\n"+SCORE).attr({ fill: 'white'});
scorelabel.attr({"font-size": 40});


var planet1 = new Planet(320,300,50,120);
planet1.draw();
/*
planet1.text.attr({text:"Start Game!"});
var scorelabel = paper.text(320,600,"Start Game!",r({ fill: 'white'});
scorelabel.attr({"font-size": 16});

*/
var planet2 = new Planet(360, 150, 60, 120);
planet2.type = 4; // press 10 times
planet2.draw();

var planet3 = new Planet(planet2.x+Math.random()*50+100,
                         -50,30+Math.random()*60, 120);
planet3.type = 0;
planet3.draw();


PLANETS.push(planet1);
PLANETS.push(planet2);
PLANETS.push(planet3);

dot = paper.circle(planet1.x, planet1.y + planet1.orbit, RADIUS_OF_THE_BALL);
dot.attr("fill", "#FFF");
dot.attr("stroke", "#FFF");
dot.leaving_planet = null;
dot.orbiting_planet = planet1;
dot.status = 0;
dot.CLOCKWISE = false;
dot.TIME = 0;
dot.THETA0 = 0;
dot.lose = false;

DOTS.push(dot); // save dot;



var click_event = function(){  
    if(GAME_OVER){
        GAME_OVER = false;
        background = paper.rect(0,0,WIDTH,HEIGHT);
        background.attr("fill", BACKGROUND_COLOR);
        // reset everything
        COUNT = 0;
        RADIUS_OF_THE_BALL = 10;
        TIME_INTERVAL = 30;
        PLANETS = [];
        DOTS = [];        
        BUTTON_CLICKED = 0;
        SCORE = 0;
        MOVE_DOWN_SPEED = 0;
        
        scorelabel = paper.text(100,100,"Score\n"+SCORE).attr({ fill: 'white'});
        scorelabel.attr({"font-size": 40});
        
        planet1 = new Planet(320,300,50,120);
        planet1.draw();
        
        planet2 = new Planet(360, 150, 60, 120);
        planet2.type = 4; // 
        planet2.draw();
        
        planet3 = new Planet(planet2.x+Math.random()*50+100,
                         -50,30+Math.random()*60, 120);
        planet3.type = 0;
        planet3.draw();
        
        PLANETS.push(planet1);
        PLANETS.push(planet2);
        PLANETS.push(planet3);
        
        dot = paper.circle(planet1.x, planet1.y + planet1.orbit, RADIUS_OF_THE_BALL);
        dot.attr("fill", "#FFF");
        dot.attr("stroke", "#FFF");
        dot.leaving_planet = null;
        dot.orbiting_planet = planet1;
        dot.status = 0;
        dot.CLOCKWISE = false;
        dot.TIME = 0;
        dot.THETA0 = 0;
        dot.lose = false;
        
        DOTS.push(dot); // save dot;
        
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
            var x = (dot.attr("cx") - dot.orbiting_planet.x); // smallx - bigx
            var y = (dot.attr("cy") - dot.orbiting_planet.y); // smally - bigy
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
var game_is_over = function(){
    scorelabel.animate({"font-size": 80, x:WIDTH/2, y:HEIGHT/2, text:"Score:\n"+SCORE}, 500)
    //alert("GAME OVER");
}
setInterval(function(){
    MOVE_DOWN_SPEED+=0.02*parseInt(SCORE/100);
    if(MOVE_DOWN_SPEED > 2.5){
        MOVE_DOWN_SPEED = 2.5;
    }
    COUNT = COUNT + 1 + parseInt(SCORE/100);
    if(COUNT > 200){
        COUNT = 0;
        var planet = new Planet((Math.random()-0.5)*600+650,0, 50+50 * Math.random(),100);
        planet.type = parseInt(Math.random()*7);
        planet.used = 0;
        planet.draw();
        PLANETS.push(planet);
    }
    // show score
    scorelabel.attr({text: "Score\n" + SCORE})
    //if(BUTTON_CLICKED) return;
    for(var i = 0; i < PLANETS.length; i++){ // move each planet down
        var p = PLANETS[i];
        if(p.can_be_used === false) continue;
        p.move_down(); // move down
        if(p.planet.attr("cy") >= HEIGHT + 200){p.can_be_used = false; continue;} // too low
        if( p.type === 4 && p.used === 1) { // check explosion
            p.exploding_timer -= TIME_INTERVAL;
            if(p.exploding_timer < 0){
                var save_ = p;
                p.can_be_used = false;
                save_.planet.animate({fill: "#fffe33", r: p.radius + 30}, 1000, function(){
                    save_.planet.animate({fill: BACKGROUND_COLOR, r: 0}, 1000); // explosion effect
                    save_.text.attr({text: "Boom!!!"})
                    save_.text.animate({fill: BACKGROUND_COLOR}, 1000, function(){
                        save_.text.animate({y:HEIGHT + 200}); // clear text and planet
                        save_.planet.animate({cy:HEIGHT + 200});
                    });
                })
               
                //setTimeout(function() {
                //    p.planet.animate({fill: BACKGROUND_COLOR, r: 0}, 1000); // explosion effect
                //    p.text.animate({fill: BACKGROUND_COLOR, text: "Boom!!!"}, 1000);
                //}, 1000);
               
                for(var j = 0; j < DOTS.length; j++){
                    if(DOTS[j].status === 1) continue;
                    if(DOTS[j].lose) continue;
                    if(DOTS[j].orbiting_planet === PLANETS[i]){
                        DOTS[j].lose = true;
                        DOTS[j].attr({cx: HEIGHT + 400, cy:-100});
                    }
                }
                //PLANETS[i].planet.animate({cx:HEIGHT + 400},0);
            }
            else
                p.text.attr({text: parseInt(PLANETS[i].exploding_timer/1000)+""})
        }
    }
    GAME_OVER = true;
    var dot;
    var LENGTH = DOTS.length;
    for(var i = 0; i < LENGTH; i++){
        dot = DOTS[i];
        dot.TIME += TIME_INTERVAL;
        
        if(dot.lose) continue;
        
        if(dot.attr("cy") > HEIGHT + 100 || dot.attr("cx") <= 0 - 100 || dot.attr("cx") >= WIDTH + 100 || dot.attr("cy") <= 0 - 100){
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
            dot.animate({cx:x, cy:y});
        }
        else{ // flying
            //console.log("FLYING X: " + dot.attr("cx") + " Y: " + dot.attr("cy"));
            for(var j = 0; j < PLANETS.length; j++){
                var p = PLANETS[j];
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
                                p.press_count = 10;
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
                                    var new_dot = paper.circle(dot.orbiting_planet.x + (dot.orbiting_planet.orbit)*Math.cos(ran), 
                                                           dot.orbiting_planet.y + (dot.orbiting_planet.orbit)*Math.sin(ran), 
                                                           RADIUS_OF_THE_BALL);
                                    new_dot.attr("fill", "#FFF");
                                    new_dot.attr("stroke", "#FFF");
                                    new_dot.leaving_planet = dot.leaving_planet;
                                    new_dot.orbiting_planet = dot.orbiting_planet;
                                    new_dot.status = 0;
                                    new_dot.CLOCKWISE = Math.random() > 0.5? dot.CLOCKWISE : -dot.CLOCKWISE;
                                    new_dot.TIME = 0;
                                    new_dot.THETA0 = ran;
                                    new_dot.lose = false;
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
                        if(dot.attr("cy") - dot.orbiting_planet.y > 0){
                           if(Math.abs(dot.V_X/dot.V_Y)<1)
                               dot.CLOCKWISE = false;
                           else
                               dot.CLOCKWISE = true;}
                        else 
                               dot.CLOCKWISE = true;
                          
                    }
                    else{
                        if(dot.attr("cy") - dot.orbiting_planet.y > 0){
                           if(Math.abs(dot.V_X/dot.V_Y) <1)
                                dot.CLOCKWISE = true;
                            else 
                            dot.CLOCKWISE = false;}
                        else 
                            dot.CLOCKWISE = false;
                            
                    }
                    if(dot.attr("cx") - dot.orbiting_planet.x >= 0)
                        dot.THETA0 = Math.atan((dot.attr("cy") - dot.orbiting_planet.y)
                                       /(dot.attr("cx") - dot.orbiting_planet.x))
                    else 
                        dot.THETA0 = Math.atan((dot.attr("cy") - dot.orbiting_planet.y)
                                       /(dot.attr("cx") - dot.orbiting_planet.x)) + Math.PI;
                    
                    break;
                }
            }
            if(dot.status !== 0)
                dot.animate({cx:dot.attr("cx") + dot.V_X*1.2, cy:dot.attr("cy") + dot.V_Y*1.2});
        }
    }
    if(GAME_OVER) // game over
        game_is_over();
}   , TIME_INTERVAL)

    
    
    
    