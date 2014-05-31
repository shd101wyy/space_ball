
function tick(){
    if(GAME_START === false) return;
    MOVE_DOWN_SPEED += 0.02*parseInt(SCORE/100);
    if(MOVE_DOWN_SPEED > 3.0){
        MOVE_DOWN_SPEED = 3.0;
    }
    SCORE += 0.01;
    COUNT = COUNT + MOVE_DOWN_SPEED;
    if(COUNT > 80 + (MOVE_DOWN_SPEED) * 30){
        COUNT = 0;
        generate_new_planet();
    }
    // show score
    scorelabel.attr({text: "Score\n" + parseInt(SCORE)})
    //if(BUTTON_CLICKED) return;
    for(var i = PLANETS_START; i < PLANETS.length; i++){ // move each planet down
        var p = PLANETS[i];
        if(p === null) continue;
        if(p.can_be_used === false) {
            PLANETS[i] = null;
            // PLANETS_START = i;
            continue;
        }
        p.move_down(); // move down
        if(p.planet.y >= HEIGHT + 200){
            // p.can_be_used = false; 
            PLANETS[i] = null;
            PLANETS_START = i;
            continue;
        } // too low
        if( p.type === 4 && p.used === 1) { // check explosion
            if(p.exploding_timer == 2){ // 为了保证肯定能跳
                generate_new_planet(); 
            }
            /*
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
            */
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
                                    /*
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
                                    */
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
        //scorelabel.attr("text", "Press Space or Click or Touch Screen to Start\nScore\n"+parseInt(SCORE));
        //scorelabel.attr({"font-size": 40});
        game_is_over();
    }
    stage.update();
}

createjs.Ticker.addEventListener("tick", tick);
// these are equivalent, 1000ms / 30fps = 33ms
createjs.Ticker.setInterval(33);
createjs.Ticker.setFPS(40);

    
    
    