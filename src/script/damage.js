class Damage{
    constructor({id, x, y, owner_id, owner, type, side, character_width, character_height, lastTimestamp}){
        this.id = id

        this.position ={
            x,
            y
        }
        this.velocity={
            x : 0,
            y : 0
        }
        this.width = 42
        this.height = 42
        this.targetRange = 150 

        this.lastDamage = new Array() //saves id of target that has already taken damage

        this.frameTime = 30
        this.frames = 0
        this.damageCount = 1//for mult damages
        this.lastTimestamp = lastTimestamp
        this.positionTimestamp = lastTimestamp
        this.finished = false
        this.isKnockBack = true //enable or disable knock back
        this.isSoundPlayed = false

        this.owner = owner
        this.owner_id = owner_id

        this.sprites = {
            sprite : createImage('')             
        }        

        this.type = type   
        switch (type){
            case 'power_blade':
                this.width = 100
                this.height = 100

                this.power = 40
                this.attack_percentage = 200
                this.bonus_dexterity = 5
                this.time = 60
                this.count_time = 0  
                this.speed = 1.5
                this.stun = 50  
                this.coolDown = 30
                this.sp_value = 40

                this.sprites.sprite = createImage('src/image/attack_power_sword.png')
                this.sprites.width = 100
                this.sprites.height = 100
                this.sprites.currentCropWidth = 42
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 42
                this.sprites.cropHeight = 42
            break

            case 'rapid_blade':
                this.width = 50
                this.height = 50

                this.power = 10
                this.attack_percentage = 140
                this.bonus_dexterity = 3
                this.time = 10
                this.count_time = 0  
                this.damageCount = 3
                this.speed = 2.5
                this.stun = 30    
                this.coolDown = 28
                this.sp_value = 35

                this.sprites.sprite = createImage('src/image/attack_power_sword.png')
                this.sprites.width = 50
                this.sprites.height = 50
                this.sprites.currentCropWidth = 42
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 42
                this.sprites.cropHeight = 42
            break
            
            case 'phanton_blade':
                this.width = 100
                this.height = 100

                this.power = 0
                this.attack_percentage = 50
                this.bonus_dexterity = 10
                this.time = 80  
                this.count_time = 0                
                this.damageCount = 30
                this.speed = 0
                this.stun = 100    
                this.coolDown = 120
                this.sp_value = 30

                this.isKnockBack = false

                this.sprites.sprite = createImage('src/image/attack_phanton_blade.png')
                this.sprites.width = 100
                this.sprites.height = 100     
                this.sprites.currentCropWidth = 84
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 84
                this.sprites.cropHeight = 84
            break

            case 'ghost_blade':
                this.width = 50
                this.height = 50

                this.power = 10
                this.attack_percentage = 30
                this.bonus_dexterity = 10
                this.time = 10
                this.count_time = 0  
                this.damageCount = 50
                this.speed = 0.2
                this.stun = 4   
                this.coolDown = 50
                this.sp_value = 25

                this.isKnockBack = true

                this.sprites.sprite = createImage('src/image/attack_power_sword.png')
                this.sprites.width = 50
                this.sprites.height = 50
                this.sprites.currentCropWidth = 42
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 42
                this.sprites.cropHeight = 42
            break

            case 'cure':
                this.width = 100
                this.height = 100

                this.power = 0 
                this.time = 50   
                this.count_time = 0            
                this.damageCount = 10
                this.speed = 0
                this.stun = 0    
                this.coolDown = 100
                this.sp_value = 40      
                
                this.isKnockBack = false

                this.sprites.sprite = createImage('src/image/cure.png')        
                this.sprites.width = 100
                this.sprites.height = 100     
                this.sprites.currentCropWidth = 84
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 84
                this.sprites.cropHeight = 84
            break

            default:       
                this.width = this.width
                this.height = this.height  

                this.power = 8
                this.time = 10   
                this.count_time = 0  
                this.attack_percentage = 100
                this.bonus_dexterity = 0                
                this.speed = 4
                this.stun = 10

                this.sprites.sprite = createImage('src/image/attack_sword.png')  
                this.sprites.width = 42
                this.sprites.height = 42
                this.sprites.currentCropWidth = 42
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 42
                this.sprites.cropHeight = 42
        }

        this.count_time = this.time 
        
        this.currentSprite = this.sprites.sprite

        this.side = side
        if(type == 'phanton_blade' || type == 'cure'){
            this.position.x = x - this.width/2 + character_width /2
            this.position.y = (y + character_height /2) - (this.height/2) 
            this.sprites.currentCropHeight = 0

        }else{
            switch (side){
                case 'up':
                    this.position.x = (x + character_width /2) - (this.height/2)
                    this.position.y = y - this.height/2 + character_height /2//- this.width //- this.height
                    this.sprites.currentCropHeight = this.sprites.cropHeight*2
                    this.velocity.y = -this.speed
                break
    
                case 'down':
                    this.position.x = (x + character_width /2) - (this.height/2)
                    this.position.y = y - this.height/2 + character_height /2 //+ character_height 
                    this.sprites.currentCropHeight = this.sprites.cropHeight*3
                    this.velocity.y = this.speed
                break
    
                case 'left':
                    this.position.x = x - this.width/2 + character_width /2//- this.width
                    this.position.y = (y + character_height /2) - (this.height/2) 
                    this.sprites.currentCropHeight = 0
                    this.velocity.x = -this.speed
                break
    
                case 'right':
                    this.position.x = x - this.width/2 + character_width /2//+ character_width 
                    this.position.y = (y + character_height /2) - (this.height/2)
                    this.sprites.currentCropHeight = this.sprites.cropHeight
                    this.velocity.x = this.speed
                break
            }
        }       
    }

    draw(){

        this.debug()

        if(this.type == 'cure'){
            // context.fillStyle = '#1b690f55'
            // context.fillRect(this.position.x, this.position.y, this.width, this.height)
            var radius = 50
            context.beginPath()
            context.arc(this.position.x + this.width/2, this.position.y + (this.height/2), radius, 0, 2 * Math.PI, false)
            context.fillStyle = '#1b690f22'
            context.fill()

            // context.lineWidth = 2
            // context.strokeStyle = 'black'
            // context.stroke()             
            
            // context.beginPath()
            // context.arc(player.position.x + player.width/2, player.position.y + player.height/2, 2, 0, 2 * Math.PI, false)
            // context.fillStyle = 'black'
            // context.fill()
        }

        this.center_x = (this.position.x + this.width/2) - (this.sprites.width/2)
        this.center_y = (this.position.y + this.height - this.sprites.height)

        context.drawImage(          
            this.currentSprite, 
            this.sprites.currentCropWidth * this.frames, //corte no eixo x
            this.sprites.currentCropHeight, //corte no eixo y
            this.sprites.cropWidth, //largura do corte
            this.sprites.cropHeight, //altura do corte
            this.center_x, 
            this.center_y - 10,
            this.sprites.width,
            this.sprites.height
        )
    }

    update(){
        if(lastTimestamp - this.frameTime > this.lastTimestamp){
            this.frames++            
            this.lastTimestamp = lastTimestamp
        }

        if(this.frames > 3){            
            this.frames = 0
            this.lastTimestamp = lastTimestamp
        } 

        if(lastTimestamp - 2 > this.positionTimestamp){            
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
            this.positionTimestamp = lastTimestamp
        }
        this.draw()
    }

    debug(){        
        // if(this.owner_id == 'Kyo'){
        //     context.fillStyle = '#ff000055'
        // }else{
        //     context.fillStyle = 'green'
        // }
        // context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

function damage_action(damage){
    if(damage.count_time <= 0){
        
        switch(damage.type){

            case 'rapid_blade':
                if(damage.damageCount > 1){
                    switch(damage.owner_id){                
                        case 'p1':
                            weapon = new Weapon({x : player.position.x, y : player.position.y, owner_id : 'p', type : 'sword_2', side : player.state.side})
                            weapons.push(weapon)
                        break
                        case 'p2':
                            weapon = new Weapon({x : player2.position.x, y : player2.position.y, owner_id : 'p2', type : 'sword_2', side : player2.side})
                            weapons.push(weapon)
                        break
                    }  
                    damage.lastDamage = new Array()
                    damage.damageCount -= 1
                    damage.count_time = damage.time
                }else{
                    //damages.pop(damage)  
                    damage.finished = true
                }  
            break

            case 'ghost_blade':
                if(damage.damageCount > 1){
                    damage.lastDamage = new Array()
                    damage.damageCount -= 1
                    damage.count_time = damage.time
                }else{
                    //damages.pop(damage)  
                    damage.finished = true
                }  
            break

            case 'phanton_blade':
                if(damage.damageCount > 1){
                    switch(damage.owner_id){                
                        case 'p1':
                            weapon = new Weapon({x : player.position.x, y : player.position.y, owner_id : 'p', type : 'sword_2', side : player.state.side})
                            weapons.push(weapon)
                        break
                        case 'p2':
                            weapon = new Weapon({x : player2.position.x, y : player2.position.y, owner_id : 'p2', type : 'sword_2', side : player2.side})
                            weapons.push(weapon)
                        break
                    }  
                    damage.lastDamage = new Array()
                    damage.damageCount -= 1
                    damage.count_time = 5
                    damage.stun = 5
                }else{
                    //damages.pop(damage)  
                    damage.finished = true
                } 
            break

            case 'cure':
                if(damage.damageCount > 1){ 
                    damage.lastDamage = new Array()
                    damage.damageCount -= 1
                    damage.count_time = damage.time
                }else{
                    //damages.pop(damage)  
                    damage.finished = true
                } 
            break

            default:
                damage.finished = true
        }

    }else{
        damage.count_time -= 1
        //damage.draw()

        //damage sound is played only 1 time per damage area
        // if(damage.lastDamage.length > 0 && damage.isSoundPlayed){                    
        //     //swordSlashSound() 
        //     damage.isSoundPlayed = false
        // }

        if(damage.owner == 'player'){

            //Do not execute damage if damage owner is not de player
            if (damage.owner_id !== player.id){
                return
            }  

            var inteligence = player.attributes.inteligence            

            if(damage.type == 'cure'){
                playerCure(damage, player, inteligence)
                if(player2 != null){
                    playerCure(damage, player2, inteligence)
                }                
            }else{
                playerDamagePlayer(damage)                
            }
        }  
        
        // if(damage.owner == 'cpu'){
        //     enemyDamage(damage, player)
        //     enemyDamage(damage, player2)
        // }
    }
}

function enemyDamage(damage, player){

    if(player == null){
        return
    }
    
    if (square_colision_area(damage, player)) {
          
        //If enemy is dead
        var enemy = enemies.find(element => element.id == damage.owner_id)
        if(enemy == undefined){
            //console.log('undefined enemy')
            return
        } 

        //if the player has already been hit
        var id = damage.lastDamage.filter(element => element == player.id)
        if(id == 'p1' || id == 'p2'){
            return
        }
        damage.lastDamage.push(player.id)          

        var is_hit = dexterity_vs_flee(enemy.attributes.dexterity, player.attributes.agility)            
        if(player.state.defending){
            is_hit = true
        }

        if(is_hit){   

            var result = attack_vs_defense(enemy.attributes_values.attack, enemy.attributes.dexterity, player.attributes_values.defense)
            if(player.state.defending){ 

                res_stm = player.attributes_values.stamina - result
                if(res_stm < 0){
                    player.attributes_values.stamina = 0 
                    player.state.defending = false
                    //result += Math.round(res_stm)
                    //result += res_stm
                    player.attributes_values.hp += res_stm  
                    if(player.attributes_values.hp <= 0){
                        player.attributes_values.hp = 0.0
                    }                       
                    swordSlashSound()  
                    display = new Display({x : player.position.x + player.width/2, y : player.position.y + player.height/2, color : 'red', text : result, type : 'damage'})
                    displays.push(display)                     

                }else{
                    shieldSound()
                    player.attributes_values.stamina = player.attributes_values.stamina - stamina_vs_attack(result)
                    //damages.pop(damage)
                    if(damage.type==''){  
                        damage.finished = true
                    }
                }  
                
                player.stamina.staminaCooldown = 50

            }else{
                player.attributes_values.hp -= result  
                if(player.attributes_values.hp < 0){
                    player.attributes_values.hp = 0
                }                  
                swordSlashSound()          
                display = new Display({x : player.position.x + player.width/2, y : player.position.y + player.height/2, color : 'red', text : result, type : 'damage'})
                displays.push(display)
            }
            
            var knock_val = knock_back(damage.power, enemy.attributes.power, player.attributes.power)
            if(damage.isKnockBack){
                switch (damage.side){
                    case 'up': 
                        if(player.position.y - knock_val <= 0){
                            player.position.y = 0
                        }else{
                            player.position.y -= knock_val
                        }                      
                    break
    
                    case 'down':
                        if(player.position.y + player.height + knock_val >= background.height){
                            player.position.y = background.height - player.height
                        }else{
                            player.position.y += knock_val
                        }
                    break
    
                    case 'left':
                        if(player.position.x - knock_val <= 0){
                            player.position.x = 0
                        }else{
                            player.position.x -= knock_val
                        }
                    break
    
                    case 'right':
                        if(player.position.x + player.width + knock_val >= background.width){
                            player.position.x = background.width - player.width
                        }else{
                            player.position.x += knock_val
                        }
                    break                    
                }
            }

        }else{
            display = new Display({x : player.position.x + player.width/2, y : player.position.y + player.height/2, color : 'yellow', text : 'MISS', type : 'damage'})
            displays.push(display)
        }  

        if(player.attributes_values.hp <= 0){
            return
        }
    }
}

function playerDamage(damage){
    enemies.forEach(enemy => {
        if(damage.owner == 'cpu'){
            console.log('wrong damage detected')
        }
        if (square_colision_area(damage, enemy)) {
            
            //this is to not double damage
            var p = damage.lastDamage.filter(element => element == enemy.id)
            if(p == enemy.id){
                return
            }
            damage.lastDamage.push(enemy.id)
            
            var is_hit = false
            switch(damage.owner_id){
                case 'p1':
                    is_hit = dexterity_vs_flee(player.attributes.dexterity + damage.bonus_dexterity, enemy.attributes.agility)
                break
                case 'p2':
                    is_hit = dexterity_vs_flee(player.attributes.dexterity + damage.bonus_dexterity, enemy.attributes.agility)
                break
            }                    
            
            if(is_hit){                        
                var result = 0
                switch(damage.owner_id){
                    case 'p1':
                        result = attack_vs_defense(
                            player.attributes_values.attack * damage.attack_percentage / 100, 
                            player.attributes.dexterity + damage.bonus_dexterity, 
                            enemy.attributes_values.defense
                        )
                    break
                    case 'p2':
                        result = attack_vs_defense(
                            player2.attributes_values.attack * damage.attack_percentage / 100, 
                            player2.attributes.dexterity + damage.bonus_dexterity, 
                            enemy.attributes_values.defense
                        )
                    break
                }  

                enemy.attributes_values.hp -= result   
                enemy.stunTime = damage.stun  

                if(!damage.isSoundPlayed){
                    swordSlashSound() 
                    damage.isSoundPlayed = true 
                }    

                if(enemy.attributes_values.hp <= 0){
                    screamSound()
                }          
                display = new Display({x : enemy.position.x + enemy.width/2, y : enemy.position.y + enemy.height/2, color : 'red', text : result, type : 'damage'})
                displays.push(display)

                if(!enemy.knock_back || !damage.isKnockBack){
                    return
                }

                var pl
                switch(damage.owner_id){
                    case 'p1':
                        pl = player
                    break                      

                    case 'p2':
                        pl = player2
                    break                             
                }

                var knock_val = knock_back(damage.power, pl.attributes.power, enemy.attributes.power)
                switch (damage.side){
                    case 'up':   
                        
                        if(enemy.position.y - knock_val <= 0){
                            enemy.position.y = 0
                        }else{                     
                            enemy.position.y -= knock_val
                        }
                    break

                    case 'down':
                        if(enemy.position.y + enemy.height + knock_val >= background.height){
                            enemy.position.y = background.height - enemy.height
                        }else{
                            enemy.position.y += knock_val
                        }
                    break

                    case 'left':
                        if(enemy.position.x - knock_val <= 0){
                            enemy.position.x = 0
                        }else{
                            enemy.position.x -= knock_val
                        }
                    break

                    case 'right':
                        if(enemy.position.x + enemy.width + knock_val >= background.width){
                            enemy.position.x = background.width - enemy.width
                        }else{
                            enemy.position.x += knock_val
                        }
                    break 
                }
            }else{
                display = new Display({x : enemy.position.x + enemy.width/2, y : enemy.position.y + enemy.height/2, color : 'yellow', text : 'MISS', type : 'damage'})
                displays.push(display)
            }    
        }
    }) 
}

function playerDamagePlayer(damage){
    players.forEach(enemy => {
        if(damage.owner == undefined){
            console.log('wrong damage detected')
        }
        if (damage.owner_id != enemy.id && square_colision_area(damage, enemy)) {
            
            //this is to not double damage
            var p = damage.lastDamage.filter(element => element == enemy.id)
            if(p == enemy.id){
                return
            }
            damage.lastDamage.push(enemy.id)
            
            var is_hit = is_hit = dexterity_vs_flee(
                player.attributes.dexterity + damage.bonus_dexterity, 
                enemy.attributes.agility
            )                                 
            
            if(is_hit){                        
                var result = attack_vs_defense(
                    player.attributes_values.attack * damage.attack_percentage / 100, 
                    player.attributes.dexterity + damage.bonus_dexterity, 
                    enemy.attributes_values.defense
                )

                var stamina_result = 0
                if(enemy.state.defending){ 
    
                    res_stm = enemy.attributes_values.stamina - result
                    if(res_stm < 0){
                        enemy.attributes_values.stamina = 0 
                        enemy.state.defending = false
                        enemy.attributes_values.hp += res_stm  
                        if(enemy.attributes_values.hp <= 0){
                            enemy.attributes_values.hp = 0.0
                        }                       
                        //swordSlashSound()  
                        // display = new Display({x : enemy.position.x + enemy.width/2, y : enemy.position.y + 
                        // enemy.height/2, color : 'red', text : result, type : 'damage'})
                        // displays.push(display)                     
    
                    }else{
                        //shieldSound()
                        stamina_result = stamina_vs_attack(result)
                        enemy.attributes_values.stamina = enemy.attributes_values.stamina - stamina_result
                        if(damage.type==''){  
                            damage.finished = true
                        }
                        
                        result = 0
                    }  
                    
                    //enemy.stamina.staminaCooldown = 50
    
                }else{
                    enemy.attributes_values.hp -= result  
                    if(enemy.attributes_values.hp < 0){
                        enemy.attributes_values.hp = 0
                    }                  
                    //swordSlashSound()          
                    // display = new Display({x : enemy.position.x + enemy.width/2, y : enemy.position.y + 
                    //     enemy.height/2, color : 'red', text : result, type : 'damage'})
                    // displays.push(display)
                }

                //enemy.stunTime = damage.stun  

                if(!damage.isSoundPlayed){
                    //swordSlashSound() 
                    damage.isSoundPlayed = true 
                }    

                if(enemy.attributes_values.hp <= 0){
                    //screamSound()
                }          
                display = new Display({x : enemy.position.x + enemy.width/2, y : enemy.position.y + 
                enemy.height/2, color : 'red', text : result, type : 'damage'})
                displays.push(display)

                if(!damage.isKnockBack){
                    sendDamage(enemy.id, result, null, null, stamina_result)
                    return
                }
                var knock_val = knock_back(damage.power, player.attributes.power, enemy.attributes.power)
                switch (damage.side){
                    case 'up':   
                        
                        if(enemy.position.y - knock_val <= 0){
                            enemy.position.y = 0
                        }else{                     
                            enemy.position.y -= knock_val
                        }
                    break

                    case 'down':
                        if(enemy.position.y + enemy.height + knock_val >= background.height){
                            enemy.position.y = background.height - enemy.height
                        }else{
                            enemy.position.y += knock_val
                        }
                    break

                    case 'left':
                        if(enemy.position.x - knock_val <= 0){
                            enemy.position.x = 0
                        }else{
                            enemy.position.x -= knock_val
                        }
                    break

                    case 'right':
                        if(enemy.position.x + enemy.width + knock_val >= background.width){
                            enemy.position.x = background.width - enemy.width
                        }else{
                            enemy.position.x += knock_val
                        }
                    break 
                }
                sendDamage(enemy.id, result, damage.side, knock_val, stamina_result)
            }else{
                display = new Display({x : enemy.position.x + enemy.width/2, y : enemy.position.y + enemy.height/2, color : 'yellow', text : 'MISS', type : 'damage'})
                displays.push(display)                
                sendDamage(enemy.id, 'MISS', null, null, 0)
            }    
        }
    }) 
}

//damage is reversed to cure
function playerCure(cure, player, inteligence){
    if(square_colision_area(cure, player)){

        if(player.attributes_values.hp >= player.attributes_values.max_hp){
            return
        }
        
        var id = damage.lastDamage.filter(element => element == player.id)
        if(id == 'p1' || id == 'p2'){
            return
        }
        damage.lastDamage.push(player.id) 

        var cure_value = cure_spell(player.attributes_values.max_hp, inteligence)
        if(cure_value > player.attributes_values.max_hp){
            player.attributes_values.hp = player.attributes_values.max_hp
        }else{
            player.attributes_values.hp += cure_value
        }
        display = new Display({x : player.position.x + player.width/2, y : player.position.y + player.height/2, color : 'green', text : Math.round(cure_value), type : 'damage'})
        displays.push(display)
 
    }
}

function sendDamage(id, result, knockback_side, knockback_val, stamina_result){
    
    var json_obj = {
        'type' : 'action_damage',
        'id' : id,
        'result' : result,
        'knockback_side' : knockback_side,
        'knockback_val' : knockback_val,
        'stamina_result': stamina_result
    }

    conn.send(JSON.stringify(json_obj))
    //console.log('send dmg type:action_damage '+ ' from:'+player.id+' to:'+id)    
}

