let lastKey
var gamepads = {}
var axes_x = 1
var axes_y = 1

var active_control = true

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
    },
    spell_type_1 : {
        pressed : false
    },
    spell_type_2 : {
        pressed : false
    },
    spell_type_3 : {
        pressed : false
    },
    spell_type_4 : {
        pressed : false
    }  
}

window.addEventListener('keydown', ({keyCode}) => {
    if (connectedGamepad()) return
    keyCodeDown(keyCode)    
})

window.addEventListener('keyup', ({keyCode}) => {
    if (connectedGamepad()) return
    keyCodeUp(keyCode)   
})

function keyCodeDown(keyCode){
    if(!active_control) return
    if (player == undefined) return

    console.log('keydown:'+keyCode) 

    switch (keyCode){ 
        case 38:
            if(!keys.up.pressed && !keys.down.pressed){
                keys.up.pressed = true       
                lastKey = 'up'  
                player.state.walking = true
                if(keys.run.pressed){
                    player.state.running = true
                }
                //console.log('keydown:'+keyCode)     
            }     
        break

        case 40:    
            if(!keys.down.pressed && !keys.down.pressed){        
                keys.down.pressed = true     
                lastKey = 'down'
                player.state.walking = true
                if(keys.run.pressed){
                    player.state.running = true
                }
                //console.log('keydown:'+keyCode)
            }
        break

        case 37:
            if(!keys.left.pressed && !keys.right.pressed){
                keys.left.pressed = true      
                lastKey = 'left'
                player.state.walking = true
                if(keys.run.pressed){
                    player.state.running = true
                }
                //console.log('keydown:'+keyCode)
            }
        break

        case 39:
            if(!keys.right.pressed && !keys.left.pressed){
                keys.right.pressed = true      
                lastKey = 'right'
                player.state.walking = true
                if(keys.run.pressed){
                    player.state.running = true
                }
                //console.log('keydown:'+keyCode)
            }
        break

        //attack
        case 97:
            if(!keys.attack.pressed && player.cooldown.attack <= 0){

                damage = new Damage({ id : lastTimestamp,
                    x : player.position.x, y : player.position.y, 
                    owner_id : player.id, owner : 'player', type : player.skill.primary_weapon_type, side : player.state.side, 
                    character_width : player.width, character_height: player.height, lastTimestamp : lastTimestamp
                })

                keys.attack.pressed = true      
                //lastKey = 'attack'
                player.state.attacking = true

                player.cooldown.attack = Math.round(player.attributes_values.attack_speed)
                swordSound()

                damages.push(damage)   
                weapon = new Weapon({x : player.position.x, y : player.position.y, owner_id : player.id, type : player.skill.primary_weapon_type, side : player.state.side})
                weapons.push(weapon)

                var json_obj = {
                    'type' : 'action_attack',
                    'damage_id' : damage.id,
                    'attack_type' : player.skill.primary_weapon_type,
                    'attributes_values' : player.attributes_values
                }        
                conn.send(JSON.stringify(json_obj)) 
            }
        break
        
        //defend
        case 103:
            switch (player.character_class){ 

                case 'knight':
                case 'squire':
                    if(!keys.defense.pressed && player.attributes_values.stamina>=5){
                        keys.defense.pressed = true  
                        player.state.defending = true
                        shieldGrabSound()
                    }
                break

                case 'mage':
                case 'wizzard':
                    keys.defense.pressed = true  
                break
            }
        break

        //run
        case 98:
            if(!keys.run.pressed && player.attributes_values.stamina>=5){
                keys.run.pressed = true  
                if (player.velocity.x != 0 || player.velocity.y != 0){
                    player.state.running = true 
                }             
                //player.stamina.staminaCooldown = 50
                //runSound()
            }
        break

        //spell_type_1
        case 100:
            if(player.skill.spell_type_1 == undefined || player.skill.spell_type_1 == '') return

            if(!keys.spell_type_1.pressed && player.cooldown.spell_type_1 == 0){

                damage = new Damage({ id : lastTimestamp,
                    x : player.position.x, y : player.position.y, 
                    owner_id : player.id, owner : 'player', type : player.skill.spell_type_1, side : player.state.side, 
                    character_width : player.width, character_height: player.height, lastTimestamp : lastTimestamp
                })
                
                if(player.attributes_values.sp - damage.sp_value < 0){
                    return 
                }

                keys.spell_type_1.pressed = true   
                player.state.attacking = true

                player.cooldown.spell_type_1 = spell_cooldown(damage.coolDown, player.attributes.inteligence, player.attributes.dexterity)   
                rapidBladeSound()
                powerSwordSound()             

                if(player.attributes_values.sp <= 0){
                    player.attributes_values.sp = 0
                }else{
                    player.attributes_values.sp -= damage.sp_value
                }
                 
                damages.push(damage)   
                weapon = new Weapon({x : player.position.x, y : player.position.y, owner_id : player.id, type : player.skill.secondary_weapon_type, side : player.state.side})
                weapons.push(weapon)

                var json_obj = {
                    'type' : 'action_attack',
                    'damage_id' : damage.id,
                    'attack_type' : player.skill.spell_type_1,
                    'attributes_values' : player.attributes_values
                }        
                conn.send(JSON.stringify(json_obj)) 

                setRumble('attack')
            }
        break

        //spell_type_2
        case 101:            
            if(player.skill.spell_type_2 == undefined || player.skill.spell_type_2 == '') return

            if(!keys.spell_type_2.pressed && player.cooldown.spell_type_2 == 0){    

                damage = new Damage({ id : lastTimestamp,
                    x : player.position.x, y : player.position.y, 
                    owner_id : player.id, owner : 'player', type : player.skill.spell_type_2, side : player.state.side, 
                    character_width : player.width, character_height: player.height, lastTimestamp : lastTimestamp
                })

                if(player.attributes_values.sp - damage.sp_value < 0){
                    return 
                }

                keys.spell_type_2.pressed = true 
                player.state.attacking = true

                player.cooldown.spell_type_2 = spell_cooldown(damage.coolDown, player.attributes.inteligence, player.attributes.dexterity)  
                rapidBladeSound()
                player.setGoogStatus(player.skill.spell_type_2)

                if(player.attributes_values.sp <= 0){
                    player.attributes_values.sp = 0
                }else{
                    player.attributes_values.sp -= damage.sp_value
                }

                damages.push(damage)
                weapon = new Weapon({x : player.position.x, y : player.position.y, owner_id : player.id, type : player.skill.secondary_weapon_type, side : player.state.side})
                weapons.push(weapon)

                var json_obj = {
                    'type' : 'action_attack',
                    'damage_id' : damage.id,
                    'attack_type' : player.skill.spell_type_2,
                    'attributes_values' : player.attributes_values
                }        
                conn.send(JSON.stringify(json_obj)) 

                setRumble('attack')
            }
        break

        //spell_type_3
        case 104:
            if(player.skill.spell_type_3 == undefined || player.skill.spell_type_3 == '') return

            if(!keys.spell_type_3.pressed && player.cooldown.spell_type_3 == 0){
        
                damage = new Damage({ id : lastTimestamp,
                    x : player.position.x, y : player.position.y, 
                    owner_id : player.id, owner : 'player', type : player.skill.spell_type_3, side : player.state.side, 
                    character_width : player.width, character_height: player.height, lastTimestamp : lastTimestamp
                });

                if(player.attributes_values.sp - damage.sp_value < 0){
                    return 
                }

                keys.spell_type_3.pressed = true  
                player.state.attacking = true

                player.cooldown.spell_type_3 = spell_cooldown(damage.coolDown, player.attributes.inteligence, player.attributes.dexterity)   
                if(player.skill.spell_type_3=='cure'){
                    cureSound()
                }else{
                    phantonBladeSound()
                }
                player.setGoogStatus(player.skill.spell_type_3)

                if(player.attributes_values.sp <= 0){
                    player.attributes_values.sp = 0
                }else{
                    player.attributes_values.sp -= damage.sp_value
                }

                damages.push(damage)
                weapon = new Weapon({x : player.position.x, y : player.position.y, owner_id : player.id, type : player.skill.secondary_weapon_type, side : player.state.side})
                weapons.push(weapon)

                var json_obj = {
                    'type' : 'action_attack',
                    'damage_id' : damage.id,
                    'attack_type' : player.skill.spell_type_3,
                    'attributes_values' : player.attributes_values
                }        
                conn.send(JSON.stringify(json_obj)) 

                setRumble('attack')
            }
        break
    
        //spell_type_4
        case 102:
            if(player.skill.spell_type_4 == undefined || player.skill.spell_type_4 == '') return

            if(!keys.spell_type_4.pressed && player.cooldown.spell_type_4 == 0){    

                damage = new Damage({ id : lastTimestamp,
                    x : player.position.x, y : player.position.y, 
                    owner_id : player.id, owner : 'player', type : player.skill.spell_type_4, side : player.state.side, 
                    character_width : player.width, character_height: player.height, lastTimestamp : lastTimestamp
                })

                if(player.attributes_values.sp - damage.sp_value < 0){
                    return 
                }

                keys.spell_type_4.pressed = true 
                player.state.attacking = true

                player.cooldown.spell_type_4 = spell_cooldown(damage.coolDown, player.attributes.inteligence, player.attributes.dexterity)  
                rapidBladeSound()
                player.setGoogStatus(player.skill.spell_type_4)

                if(player.attributes_values.sp <= 0){
                    player.attributes_values.sp = 0
                }else{
                    player.attributes_values.sp -= damage.sp_value
                }

                damages.push(damage)
                weapon = new Weapon({x : player.position.x, y : player.position.y, owner_id : player.id, type : player.skill.secondary_weapon_type, side : player.state.side})
                weapons.push(weapon)

                var json_obj = {
                    'type' : 'action_attack',
                    'damage_id' : damage.id,
                    'attack_type' : player.skill.spell_type_4,
                    'attributes_values' : player.attributes_values
                }        
                conn.send(JSON.stringify(json_obj)) 

                setRumble('attack')
            }
        break  
    }
}

function keyCodeUp(keyCode){
    if(!active_control) return
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

        case 100:
            keys.spell_type_1.pressed = false  
        break

        case 101:
            keys.spell_type_2.pressed = false  
        break

        case 104:
            keys.spell_type_3.pressed = false  
        break

        case 102:
            keys.spell_type_4.pressed = false  
        break
    }

    if(keys.up.pressed == false && keys.down.pressed == false && keys.left.pressed == false && keys.right.pressed == false){
        player.state.walking = false
        player.state.running = false
    }
}

function keypadLoop(){
    if(player === undefined) return

    var diagonal_move = 0
    if(axes_x == 1 && axes_y == 1){ 
        diagonal_move = 0.707 //to correct move speed on diagonal (digital)  
    }

    if(keys.right.pressed && (player.position.x + player.width <= background.width)){  
        if(keys.up.pressed || keys.down.pressed){
            player.velocity.x = player.attributes_values.speed * diagonal_move * axes_x
        }else{
            player.velocity.x = player.attributes_values.speed * axes_x
        }
        if(axes_x > axes_y){
            lastKey = 'right'
        }
    } else if (keys.left.pressed && (player.position.x > 0)){
        if(keys.up.pressed || keys.down.pressed){
            player.velocity.x = -player.attributes_values.speed * diagonal_move * axes_x
        }else{
            player.velocity.x = -player.attributes_values.speed * axes_x
        }
        if(axes_x > axes_y){
            lastKey = 'left'
        }
    }else{
        player.velocity.x = 0
    }

    if (keys.up.pressed && (player.position.y > 0)){
        if(keys.right.pressed || keys.left.pressed){
            player.velocity.y = -player.attributes_values.speed * diagonal_move * axes_y
        }else{
            player.velocity.y = -player.attributes_values.speed * axes_y
        }
        if(axes_y > axes_x){
            lastKey = 'up'
        }
    } else if (keys.down.pressed && (player.position.y + player.height <= background.height)){
        if(keys.right.pressed || keys.left.pressed){
            player.velocity.y = player.attributes_values.speed * diagonal_move * axes_y
        }else{
            player.velocity.y = player.attributes_values.speed * axes_y
        }   
        if(axes_y > axes_x){
            lastKey = 'down'
        }
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
        console.log('Gamepad Index ID:' + gamepad.index + ' is connected')
    } else {
        delete gamepads[gamepad.index]        
        console.log('Gamepad Index ID:' + gamepad.index + ' is disconnected')
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
    if (!connectedGamepad()) return
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [])
    var gp = gamepads[0]

    //console.log(gp) 
    
    if (gp.axes[0] < -0.1 || gp.axes[0] > 0.1){
        axes_x = Math.abs(gp.axes[0])   
    }else{
        axes_x = 1
    }

    if (gp.axes[1] < -0.1 || gp.axes[1] > 0.1){
        axes_y = Math.abs(gp.axes[1])   
    }else{
        axes_y = 1
    }

    //TS L Left
    if (gp.axes[0] < -0.1 || buttonPressed(gp.buttons[14])){
        keyCodeDown(37)
    }else{
        keyCodeUp(37)
    }

    //TS L Right
    if (gp.axes[0] > 0.1 || buttonPressed(gp.buttons[15])){
        keyCodeDown(39)
    }else{
        keyCodeUp(39)
    }

    //TS L Up
    if (gp.axes[1] < -0.1 || buttonPressed(gp.buttons[12])){
        keyCodeDown(38)
    } else {
        keyCodeUp(38)
    }

    //TS L Down
    if (gp.axes[1] > 0.1 || buttonPressed(gp.buttons[13])){
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

    return false
}

function connectedGamepad(){
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [])
    if (!gamepads) return false

    if(gamepads[0]==null) return false
    if(!gamepads[0].connected) return false
    return true
}

function setRumble(type){

    if (!connectedGamepad()) return

    switch (type){
        case 'attack':
            gamepads[0].vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 100,
                weakMagnitude: 1.0,
                strongMagnitude: 1.0,
            })
        break

        case 'running':
            gamepads[0].vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 10,
                weakMagnitude: 0.01,
                strongMagnitude: 0.01,
            })
        break

        case 'damage':
            gamepads[0].vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 100,
                weakMagnitude: 1.0,
                strongMagnitude: 1.0,
            })
        break
    }

    
}