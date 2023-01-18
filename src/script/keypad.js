let lastKey, lastKey2

const keys = {
    right : {
        pressed : false
    },
    left : {
        pressed : false
    },
    up : {
        pressed : false
    },
    down : {
        pressed : false
    },
    attack : {
        pressed : false
    },
    defense : {
        pressed : false
    },
    run : {
        pressed : false
    }
}

window.addEventListener('keydown', ({keyCode}) => {
    keyCodeDown(keyCode)    
})

window.addEventListener('keyup', ({keyCode}) => {
    keyCodeUp(keyCode)   
})

function keyCodeDown(keyCode){
    
    if (player == undefined) return

    switch (keyCode){
        
        case 38:
            if(!keys.up.pressed && !keys.down.pressed){
                keys.up.pressed = true       
                lastKey = 'up'  
                player.state.walking = true
                //console.log('keydown:'+keyCode)     
            }     
        break

        case 40:    
            if(!keys.down.pressed && !keys.down.pressed){        
                keys.down.pressed = true     
                lastKey = 'down'
                player.state.walking = true
                //console.log('keydown:'+keyCode)
            }
        break

        case 37:
            if(!keys.left.pressed && !keys.right.pressed){
                keys.left.pressed = true      
                lastKey = 'left'
                player.state.walking = true
                //console.log('keydown:'+keyCode)
            }
        break

        case 39:
            if(!keys.right.pressed && !keys.left.pressed){
                keys.right.pressed = true      
                lastKey = 'right'
                player.state.walking = true
                //console.log('keydown:'+keyCode)
            }
        break

        //attack
        case 97:
            if(!keys.attack.pressed && player.cooldown.attackCooldown <= 0){

                damage = new Damage({
                    x : player.position.x, y : player.position.y, 
                    owner_id : player.id, owner : 'player', side : player.state.side, 
                    character_width : player.width, character_height: player.height, lastTimestamp : lastTimestamp
                })

                keys.attack.pressed = true      
                lastKey = 'attack'
                player.state.attacking = true

                player.cooldown.attackCooldown = Math.round(player.attributes_values.attack_speed)
                // swordSound()

                damages.push(damage)   
                weapon = new Weapon({x : player.position.x, y : player.position.y, owner_id : player.id, type : 'sword_1', side : player.state.side})
                weapons.push(weapon)

                var json_obj = {
                    'type' : 'action_attack',
                    'attack_type' : 'common'
                }        
                conn.send(JSON.stringify(json_obj))   

            }
        break
        
        //defend
        case 103:
            if(!keys.defense.pressed && player.attributes_values.stamina>=5){
                keys.defense.pressed = true  
                player.state.defending = true
                //shieldGrabSound()
            }
        break

        //run
        case 98:
            if(!keys.run.pressed && player.attributes_values.stamina>=5){
                keys.run.pressed = true  
                player.state.running = true                
                //player.stamina.staminaCooldown = 50
                //runSound()
            }
        break
    }
}

function keyCodeUp(keyCode){
    
    if (player == undefined) return

    switch (keyCode){

        case 38:
            keys.up.pressed = false
            if(keys.left.pressed == true){
                lastKey = 'left'
            }
            if(keys.right.pressed == true){
                lastKey = 'right'
            }
        break

        case 40:            
            keys.down.pressed = false  
            if(keys.left.pressed == true){
                lastKey = 'left'
            }
            if(keys.right.pressed == true){
                lastKey = 'right'
            }
        break

        case 37:
            keys.left.pressed = false  
            if(keys.up.pressed == true){
                lastKey = 'up'
            }
            if(keys.down.pressed == true){
                lastKey = 'down'
            }
        break

        case 39:
            keys.right.pressed = false 
            if(keys.up.pressed == true){
                lastKey = 'up'
            }
            if(keys.down.pressed == true){
                lastKey = 'down'
            }
        break

        case 97:
            keys.attack.pressed = false  
        break

        case 100:
            //keys.power_blade.pressed = false  
        break

        case 103:
            keys.defense.pressed = false  
            player.state.defending = false
        break

        case 98:
            if(keys.run.pressed){                
                keys.run.pressed = false   
                player.state.running = false
                //runSoundStop()
            }
        break
    }

    if(keys.up.pressed == false && keys.down.pressed == false && keys.left.pressed == false && keys.right.pressed == false){
        player.state.walking = false
    }
}

function keypadLoop(){
    if(player === undefined) return

    if(keys.right.pressed && (player.position.x + player.width <= background.width)){
        player.velocity.x = player.attributes_values.speed
    } else if (keys.left.pressed && (player.position.x > 0)){
        player.velocity.x = -player.attributes_values.speed
    }else{
        player.velocity.x = 0
    }

    if (keys.up.pressed && (player.position.y > 0)){
        player.velocity.y = -player.attributes_values.speed
    } else if (keys.down.pressed && (player.position.y + player.height <= background.height)){
        player.velocity.y = player.attributes_values.speed    
    }else{
        player.velocity.y = 0
    }
}

function gamepadHandler(event, connecting) {
    var gamepad = event.gamepad
    // Note:
    // gamepad === navigator.getGamepads()[gamepad.index]

    if (connecting) {
        gamepads[gamepad.index] = gamepad
        console.log('gamepad_connected')
    } else {
        delete gamepads[gamepad.index]
    }
}

window.addEventListener("gamepadconnected", function(e) { gamepadHandler(e, true); })
window.addEventListener("gamepaddisconnected", function(e) { gamepadHandler(e, false); })

function buttonPressed(b) {
    //console.log(b)
    if (typeof(b) == "object") {
        return b.pressed
    }
    return b == 1.0
}

function padLoop() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [])
    if (!gamepads) {
        return
    }

    var gp = gamepads[0]
    if(gp==null)return

    //console.log(gp)

    //left
    if (buttonPressed(gp.buttons[14])) {
        keyCodeDown(37)
    }else{
        keyCodeUp(37)
    }

    if (buttonPressed(gp.axes[0])) {
        console.log('ts l right')
    }

    if (buttonPressed(gp.axes[1])) {
        console.log('ts l down')
    }

    if (buttonPressed(gp.axes[2])) {
        console.log('ts r right')
    }

    if (buttonPressed(gp.axes[3])) {
        console.log('3')
    }

    if (buttonPressed(gp.axes[4])) {
        console.log('4')
    }

    if (buttonPressed(gp.axes[5])) {
        console.log('ts r right')
    }

    if (buttonPressed(gp.axes[6])) {
        console.log('6')
    }

    if (buttonPressed(gp.axes[7])) {
        console.log('7')
    }

    if (buttonPressed(gp.axes[8])) {
        console.log('8')
    }

    if (buttonPressed(gp.axes[9])) {
        console.log('9')
    }

    //right
    if (buttonPressed(gp.buttons[15])) {
        keyCodeDown(39)
    }else{
        keyCodeUp(39)
    }

    //up
    if (buttonPressed(gp.buttons[12])) {
        keyCodeDown(38)
    } else {
        keyCodeUp(38)
    }

    //down
    if (buttonPressed(gp.buttons[13])) {
        keyCodeDown(40)
    } else {
        keyCodeUp(40)
    }

    //a
    if (buttonPressed(gp.buttons[0])) {
        keyCodeDown(98)
    }else{
        keyCodeUp(98)
    }

    //x
    if (buttonPressed(gp.buttons[2])) {
        keyCodeDown(97)
    }else{
        keyCodeUp(97)
    }

    //b
    if (buttonPressed(gp.buttons[1])) {
        keyCodeDown(101)
    } else {
        keyCodeUp(101)
    }

    //y
    if (buttonPressed(gp.buttons[3])) {
        keyCodeDown(100)
    } else {
        keyCodeUp(100)
    }

    //lb
    if (buttonPressed(gp.buttons[4])) {
        //keyCodeDown(97)
    } else {
        //keyCodeUp(97)
    }

    //rb
    if (buttonPressed(gp.buttons[5])) {
        keyCodeDown(104)
    }else{    
        keyCodeUp(104)
    }

    //lt
    if (buttonPressed(gp.buttons[6])) {
        keyCodeDown(103)
    } else {
        keyCodeUp(103)
    }

    if (buttonPressed(gp.buttons[7])) {
        
    }

    if (buttonPressed(gp.buttons[8])) {
        //console.log('b8')
    } else if (buttonPressed(gp.buttons[9])) {
        //console.log('b9')
    }

    if (buttonPressed(gp.buttons[10])) {
        //console.log('b10')
    } else if (buttonPressed(gp.buttons[11])) {
        //console.log('b11')
    }  
}