class Player{
    constructor(id, user_name, lastTimestamp, x, y, color, gender, character_class){
        this.id = id
        this.user_name = user_name
        this.start = false
        this.gender = gender
        this.character_class = character_class                     
        
        this.position ={
            x : x,
            y : y
        }
        this.velocity={
            x : 0,
            y : 0
        }
        this.width = 32
        this.height = 32

        this.lastTimestamp = lastTimestamp
        this.cooldownTimestamp = lastTimestamp
        this.effectTime = lastTimestamp        
        this.effectFrameTime = lastTimestamp

        this.frame = {
            frames : 4,
            frameTime : 0,
            standFrameTime : 500,    
            walkingFrameTime : 100,
            runningFrameTime : 0,      
            attackFrameTime : 150,
            effectFrame : 0
        }
        this.frame.runningFrameTime = this.frame.walkingFrameTime/2

        this.state = {
            walking : false,
            attacking : false,
            defending : false,
            running : false,
            side : 'down'
        }

        this.cooldown = {
            stamina : 0,
            attack : 0,
            attack2 : 0,
            spell_type_1 : 0,
            spell_type_2 : 0,
            spell_type_3 : 0,
            spell_type_4 : 0
        }

        this.attributes = {
            power : 2,
            agility : 1,
            dexterity : 1,
            vitality : 10,
            inteligence : 1

            // power : 100,
            // agility : 100,
            // dexterity : 100,
            // vitality : 100,
            // inteligence : 100
        }
        
        this.attributes_values = {
            max_hp : 0,
            max_sp : 0,
            max_stamina : 100,
    
            hp : 0,
            sp : 0,
            stamina : 0,
            
            attack : 0,
            defense : 0,
            flee : 0,
            accuracy: 0,
            knock_back : 0,

            m_attack : 0,
            m_defense : 0,
            
            speed : 3,
            attack_speed : 0,//-12,  
            hp_recovery : 0,    
            sp_recovery : 0   
        }

        this.good_status = {
            shield_reinforce : 0,
            shield_reflect : 0,
            sword_reinforce : 0,
            damage_transfer_id : 0,
            damage_transfer : 0
        }

        this.bad_status = {
            stun : 0,

            cold : 0,
            wet : 0,

            heat : 0,
            burn_id : 0,
            burn : 0,

            dirty : 0,
            petrification : 0,

            breeze : 0,
            electrification_id : 0,
            electrification : 0
        }
        
        this.skill = {
            spell_type_1 : '',    
            spell_type_2 : '',   
            spell_type_3 : '',    
            spell_type_4 : '',
            primary_weapon_type : '',
            secondary_weapon_type : ''
        }  
        this.color = color

        this.setAttributesValues()
        this.setGender()

        this.currentSprite = this.sprites.character.sprite

        this.currentShieldSprite = this.sprites.shield.sprite
        this.currentShieldCropWidth = 45

        this.message = {
            message : '',
            time : 0
        }

        this.framespeed 
        this.is_debug = false
    }

    draw(){ 
        
        if (this.is_debug) this.debug()

        //draw shield first (up only)
        if(this.state.side == 'up' && this.state.defending){

            var posx = -11
            // if(this.user_name == 'Kyo'){
            //     posx = -12
            // }else{
            //     posx = -11
            // }

            context.drawImage(          
                this.currentShieldSprite, 
                this.currentShieldCropWidth * 3,
                0,
                45, 
                45, 
                this.position.x + posx, 
                this.position.y - 4,
                this.sprites.shield.width,
                this.height
            )
        }        

        this.center_x = (this.position.x + this.width/2)// - (this.sprites.character.width/2)
        this.center_y = (this.position.y + this.height)// - (this.sprites.character.height)        

        //draw character
        context.drawImage(          
            this.currentSprite, 
            this.currentCropWidth * this.frame.frames, //corte no eixo x
            this.currentCropHeight, //corte no eixo y
            this.sprites.character.cropWidth, //largura do corte
            this.sprites.character.cropHeight, //altura do corte
            this.center_x - (this.sprites.character.width/2), 
            this.center_y - (this.sprites.character.height),
            this.sprites.character.width,
            this.sprites.character.height
        )

        if(this.state.defending){
            
            var side_num = 0
            var pos_x = -2
            var pos_y = 2

            switch(this.state.side){
                case 'down':
                    side_num = 0
                    pos_x = -2
                break

                case 'left':
                    side_num = 1
                    pos_x = -14
                break

                case 'right':
                    side_num = 2
                    pos_x = 2
                break
            }            

            //draw shield (down/left/rigth)
            if(this.state.side != 'up'){
                context.drawImage(          
                    this.currentShieldSprite, 
                    this.currentShieldCropWidth * side_num,
                    0,
                    45, //largura
                    45, //altura
                    this.position.x + pos_x, 
                    this.position.y + pos_y - 2,
                    this.sprites.shield.width,
                    this.height
                )
            }
        } 

        this.drawEffect()
        this.drawBars()      
        this.drawPlayerName()
        this.drawPlayerMessage()  
    }

    drawBars(){
        var bar_width = 40
        var bar_center_x = this.center_x - bar_width/2

        //HP bar
        if(this.attributes_values.hp < this.attributes_values.max_hp){
            context.fillStyle = 'black'
            context.fillRect(bar_center_x, this.position.y + this.height+1, bar_width, 4)
            var hp_percent = Math.round(this.attributes_values.hp * 100) / this.attributes_values.max_hp
            var bar_value = (bar_width * hp_percent) / 100
            if(hp_percent<=25){
                context.fillStyle = 'red'
            }else{
                context.fillStyle = 'green'
            }
            context.fillRect(bar_center_x, this.position.y + this.height+1, bar_value, 3)
        }

        //SP bar
        if(this.attributes_values.sp < this.attributes_values.max_sp){
            context.fillStyle = 'black'
            context.fillRect(bar_center_x, this.position.y + this.height+4, bar_width, 4)
            var sp_percent = Math.round(this.attributes_values.sp * 100) / this.attributes_values.max_sp
            var bar_value = (bar_width * sp_percent) / 100
            context.fillStyle = 'blue'        
            context.fillRect(bar_center_x, this.position.y + this.height+4, bar_value, 3)
        }

        //Stamina bar
        if(this.attributes_values.stamina < this.attributes_values.max_stamina){
            context.fillStyle = 'black'
            context.fillRect(bar_center_x, this.position.y + this.height+8, bar_width, 4)
            var stamina_percent = Math.round(this.attributes_values.stamina * 100) / this.attributes_values.max_stamina
            var bar_value = (bar_width * stamina_percent) / 100
            if(stamina_percent<=25){
                context.fillStyle = 'orange'
            }else{
                context.fillStyle = 'yellow'
            }       
            context.fillRect(bar_center_x, this.position.y + this.height+8, bar_value, 3)
        }
    }

    drawPlayerName(){
        var center_name = (this.user_name.length*6) / 2

        context.font = "10px Arial Black"
        context.fillStyle = 'black'
        context.fillText(this.user_name, this.center_x - center_name -1, (this.position.y + this.height) - (this.sprites.character.height)- 5-1) 

        context.font = "10px Arial Black"
        context.fillStyle = 'black'
        context.fillText(this.user_name, this.center_x - center_name +1, (this.position.y + this.height) - (this.sprites.character.height)- 5+1) 

        context.font = "10px Arial Black"
        context.fillStyle = 'black'
        context.fillText(this.user_name, this.center_x - center_name -1, (this.position.y + this.height) - (this.sprites.character.height)- 5+1) 

        context.font = "10px Arial Black"
        context.fillStyle = 'black'
        context.fillText(this.user_name, this.center_x - center_name +1, (this.position.y + this.height) - (this.sprites.character.height)- 5-1) 
        
        context.font = "10px Arial Black"
        context.fillStyle = '#'+this.color
        context.fillText(this.user_name, this.center_x - center_name, (this.position.y + this.height) - (this.sprites.character.height)- 5) 

    }

    drawPlayerMessage(){
        if(this.message.message != '' && this.message.time > 0){
            //Baloon
            
            var center_name = (this.message.message.length*7) / 2

            context.font = "12px Arial Black"
            context.fillStyle = 'black'
            context.fillText(this.message.message, this.center_x - center_name, (this.position.y + this.height) - (this.sprites.character.height)- 30) 

            context.font = "12px Arial Black"
            context.fillStyle = 'black'
            context.fillText(this.message.message, this.center_x - center_name+2, (this.position.y + this.height) - (this.sprites.character.height)- 30+2) 

            context.font = "12px Arial Black"
            context.fillStyle = 'black'
            context.fillText(this.message.message, this.center_x - center_name, (this.position.y + this.height) - (this.sprites.character.height)- 30+2) 

            context.font = "12px Arial Black"
            context.fillStyle = 'black'
            context.fillText(this.message.message, this.center_x - center_name+2, (this.position.y + this.height) - (this.sprites.character.height)- 30) 

            context.font = "12px Arial Black"
            context.fillStyle = '#'+this.color
            context.fillText(this.message.message, this.center_x - center_name+1, (this.position.y + this.height) - (this.sprites.character.height)- 30+1) 

            this.message.time--
        }
    }

    drawEffect(){
        
        context.save()
        context.globalAlpha = 0.8    
        var total_frames = 3            

        if(this.good_status.damage_transfer > 0){
            context.globalAlpha = 0.6
            this.effectCropWidth = 42 
            var center_x = (this.position.x + this.width/2) - (42/2)
            var center_y = (this.position.y + this.height/2) - (42/2)
            
            context.drawImage(          
                createImage('src/image/shield_magic_1.png'), 
                this.effectCropWidth * this.frame.effectFrame, //corte no eixo x
                0, //corte no eixo y
                42, //largura do corte
                42, //altura do corte
                center_x, 
                center_y-6,
                42,
                42
            )
            
            context.globalAlpha = 0.8
        } 

        if(this.bad_status.petrification > 0){
            context.globalAlpha = 1
            this.effectCropWidth = 0 
            var center_x = (this.position.x + this.width/2) - (64/2)
            var center_y = (this.position.y + this.height/2) - (64/2)
            
            context.drawImage(          
                createImage('src/image/effect_petrification.png'), 
                this.effectCropWidth, //corte no eixo x
                0, //corte no eixo y
                64, //largura do corte
                64, //altura do corte
                center_x, 
                center_y-16,
                64,
                64
            )            
            context.globalAlpha = 0.8  
        }

        if(this.bad_status.burn > 0){
            
            this.effectCropWidth = 42 
            var center_x = (this.position.x + this.width/2) - (80/2)
            var center_y = (this.position.y + this.height/2) - (80/2)
            
            context.drawImage(          
                createImage('src/image/effect_burn.png'), 
                this.effectCropWidth * this.frame.effectFrame, //corte no eixo x
                0, //corte no eixo y
                42, //largura do corte
                42, //altura do corte
                center_x, 
                center_y-6,
                80,
                80
            )
        }  

        if(this.bad_status.cold > 0){
            
            this.effectCropWidth = 0 
            var center_x = (this.position.x + this.width/2) - (64/2)
            var center_y = (this.position.y + this.height/2) - (64/2)
            
            context.drawImage(          
                createImage('src/image/effect_cold.png'), 
                this.effectCropWidth, //corte no eixo x
                0, //corte no eixo y
                64, //largura do corte
                64, //altura do corte
                center_x, 
                center_y-16,
                64,
                64
            )
        } 

        if(this.bad_status.wet > 0){
            
            this.effectCropWidth = 42 
            var center_x = (this.position.x + this.width/2) - (42/2)
            var center_y = (this.position.y + this.height/2) - (42/2)
            
            context.drawImage(          
                createImage('src/image/effect_wet.png'), 
                this.effectCropWidth * this.frame.effectFrame, //corte no eixo x
                0, //corte no eixo y
                42, //largura do corte
                42, //altura do corte
                center_x, 
                center_y,
                42,
                42
            )
        } 

        if(this.bad_status.heat > 0){
            this.effectCropWidth = 42 
            var center_x = (this.position.x + this.width/2) - (100/2)
            var center_y = (this.position.y + this.height/2) - (100/2) - 10
            
            context.drawImage(          
                createImage('src/image/effect_heat.png'), 
                this.effectCropWidth * this.frame.effectFrame, //corte no eixo x
                0, //corte no eixo y
                42, //largura do corte
                42, //altura do corte
                center_x, 
                center_y,
                100,
                100
            )
        }

        if(this.bad_status.dirty > 0){
            this.effectCropWidth = 42 
            var center_x = (this.position.x + this.width/2) - (42/2)
            var center_y = (this.position.y + this.height/2) - (42/2) - 5
            
            context.drawImage(          
                createImage('src/image/effect_dirty.png'), 
                this.effectCropWidth * this.frame.effectFrame, //corte no eixo x
                0, //corte no eixo y
                42, //largura do corte
                42, //altura do corte
                center_x, 
                center_y,
                42,
                42
            )
        }

        if(this.bad_status.breeze > 0){
            context.globalAlpha = 0.7
            this.effectCropWidth = 56 
            var center_x = (this.position.x + this.width/2) - (56/2) + 5
            var center_y = (this.position.y + this.height/2) - (56/2)
            
            context.drawImage(          
                createImage('src/image/attack_wind.png'), 
                this.effectCropWidth * this.frame.effectFrame, //corte no eixo x
                0, //corte no eixo y
                56, //largura do corte
                56, //altura do corte
                center_x, 
                center_y,
                56,
                56
            )
        }

        if(this.bad_status.electrification > 0){
            total_frames = 10
            this.effectCropWidth = 64 
            var center_x = (this.position.x + this.width/2) - (64/2)
            var center_y = (this.position.y + this.height/2) - (64/2)
            
            context.drawImage(          
                createImage('src/image/effect_electrification.png'), 
                this.effectCropWidth * this.frame.effectFrame, //corte no eixo x
                0, //corte no eixo y
                64, //largura do corte
                64, //altura do corte
                center_x, 
                center_y,
                64,
                64
            )
        } 

        context.restore()
        
        if(lastTimestamp > this.effectFrameTime + 100){
            this.effectFrameTime = lastTimestamp

            this.frame.effectFrame++
            if(this.frame.effectFrame > total_frames){
                this.frame.effectFrame = 0
            }
        }        
    }

    update(){
        //sprite switching        

        if(!this.state.attacking && this.state.walking){
            if(keys.right.pressed && lastKey === 'right'){
                this.state.side = 'right'
        
            } else if (keys.left.pressed && lastKey === 'left'){       
                this.state.side = 'left'
            
            } else if (keys.down.pressed && lastKey === 'down'){        
                this.state.side = 'down'
            
            } else if (keys.up.pressed && lastKey === 'up'){        
                this.state.side = 'up'
            }
        }

        switch (this.state.side){
            case 'right':
                this.currentCropHeight = this.sprites.character.cropHeight * 1  
            break
            case 'left':
                this.currentCropHeight = this.sprites.character.cropHeight * 2
            break
            case 'down':
                this.currentCropHeight = this.sprites.character.cropHeight * 0
            break
            case 'up':
                this.currentCropHeight = this.sprites.character.cropHeight * 3
            break
        }

        this.updateSpritesOnTime()

        if(this.state.running){
            this.cooldown.stamina = 20
            setRumble('running')
        }
        this.updateCooldowns()
        this.updateEffectTime()

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

    updateOther(){
        //sprite switching
        //if(!this.state.attacking && this.state.walking){
            switch (this.state.side){
                case 'right':
                    this.currentCropHeight = this.sprites.character.cropHeight * 1
                break

                case 'left':
                    this.currentCropHeight = this.sprites.character.cropHeight * 2
                break

                case 'down':
                    this.currentCropHeight = this.sprites.character.cropHeight * 0
                break

                case 'up':
                    this.currentCropHeight = this.sprites.character.cropHeight * 3
                break
            }
        //}

        this.updateSpritesOnTime()
    }

    updateSpritesOnTime(){
        if(lastTimestamp - this.frame.frameTime > this.lastTimestamp){
            this.frame.frames++            
            this.lastTimestamp = lastTimestamp
        }

        this.attributes_values.speed = speed_value(this.attributes.agility)
        
        if(this.state.running && !this.state.defending && this.attributes_values.stamina > 0){
            this.attributes_values.speed = speed_value(this.attributes.agility)*2
            if (keys.up.pressed || keys.down.pressed || keys.left.pressed ||keys.right.pressed){             
                this.attributes_values.stamina -= 0.5
            }
        }        
        if(this.state.defending){
            this.attributes_values.speed = speed_value(this.attributes.agility)/2
        }

        //stand
        if (!this.state.attacking && !this.state.walking){
            if(this.frame.frames > 5){
                this.frame.frames = 4
                this.frame.frameTime = this.frame.standFrameTime
                this.lastTimestamp = lastTimestamp
            }
            if(!(this.frame.frames >= 4 && this.frame.frames <= 5)){
                this.frame.frames = 4
                this.frame.frameTime = this.frame.standFrameTime
                this.lastTimestamp = lastTimestamp
            }
        }
        
        this.setFrameSpeed()

        //walk
        if (!this.state.attacking && this.state.walking){
            if(this.frame.frames > 3){
                this.frame.frames = 0
                if(this.state.running){
                    this.frame.frameTime = this.frame.runningFrameTime * this.framespeed
                }else{
                    this.frame.frameTime = this.frame.walkingFrameTime * this.framespeed
                }
                this.lastTimestamp = lastTimestamp
            }
            if(!(this.frame.frames >= 0 && this.frame.frames <= 3)){
                this.frame.frames = 0
                this.frame.frameTime = this.frame.walkingFrameTime * this.framespeed
                this.lastTimestamp = lastTimestamp
            }
        } 

        //attack
        if(this.state.attacking && this.frame.frames > 7){            
            this.frame.frames = 7
            this.state.attacking = false
            this.frame.frameTime = this.frame.attackFrameTime
            this.lastTimestamp = lastTimestamp
        }        
        if(this.state.attacking && !(this.frame.frames >= 6 && this.frame.frames <= 7)){
            this.frame.frames = 6
            this.frame.frameTime = this.frame.attackFrameTime
            this.lastTimestamp = lastTimestamp
        }
    }

    updateCooldowns(){

        if(lastTimestamp > this.cooldownTimestamp + 100){
            this.cooldownTimestamp = lastTimestamp
        }else{
            return
        }
        
        if(this.attributes_values.hp < this.attributes_values.max_hp && this.attributes_values.hp > 0){
            this.attributes_values.hp += this.attributes_values.hp_recovery
            if(this.attributes_values.hp > this.attributes_values.max_hp){
                this.attributes_values.hp = this.attributes_values.max_hp
            }
        }

        if(this.attributes_values.sp < this.attributes_values.max_sp){
            this.attributes_values.sp += this.attributes_values.sp_recovery
            if(this.attributes_values.sp > this.attributes_values.max_sp){
                this.attributes_values.sp = this.attributes_values.max_sp
            }
        }

        if(this.attributes_values.stamina < this.attributes_values.max_stamina 
            && this.cooldown.stamina <= 0 && !this.state.running){
            this.attributes_values.stamina += 1
            if(this.attributes_values.stamina > this.attributes_values.max_stamina){
                this.attributes_values.stamina = this.attributes_values.max_stamina
            }
        }else{
            if(this.cooldown.stamina > 0){
                this.cooldown.stamina -= 1
            }
        }

        if(this.cooldown.attack > 0){
            this.cooldown.attack -= 1
        }
        if(this.cooldown.attack2 > 0){
            this.cooldown.attack2 -= 1
        }

        if(this.cooldown.spell_type_1 > 0){
            this.cooldown.spell_type_1 -= 1
        }
        
        if(this.cooldown.spell_type_2 > 0){
            this.cooldown.spell_type_2 -= 1
        }

        if(this.cooldown.spell_type_3 > 0){
            this.cooldown.spell_type_3 -= 1
        }

        if(this.cooldown.spell_type_4 > 0){
            this.cooldown.spell_type_4 -= 1
        }

        //bad status
        if(this.bad_status.stun > 0){
            this.bad_status.stun -= 1
        }        

        if(this.bad_status.burn > 0){
            this.bad_status.burn -= 1
        }else{
            this.bad_status.burn_id = 0
        }

        if(this.bad_status.cold > 0){
            this.bad_status.cold -= 1
        }

        if(this.bad_status.wet > 0){
            this.bad_status.wet -= 1
        }

        if(this.bad_status.heat > 0){
            this.bad_status.heat -= 1
        }

        if(this.bad_status.dirty > 0){
            this.bad_status.dirty -= 1
        }

        if(this.bad_status.petrification > 0){
            this.bad_status.petrification -= 1
        }

        if(this.bad_status.breeze > 0){
            this.bad_status.breeze -= 1
        }

        if(this.bad_status.electrification > 0){
            this.bad_status.electrification -= 1
        }else{
            this.bad_status.electrification_id = 0
        }

        //good status
        if(this.good_status.shield_reinforce > 0){
            this.good_status.shield_reinforce -= 1
        }

        if(this.good_status.shield_reflect > 0){
            this.good_status.shield_reflect -= 1
        }   
        
        if(this.good_status.sword_reinforce > 0){
            this.good_status.sword_reinforce -= 1
        }

        if(this.good_status.damage_transfer > 0){
            this.good_status.damage_transfer -= 1
        }else{
            this.good_status.damage_transfer_id = 0
        }

    }

    updateEffectTime(){
        if(lastTimestamp > this.effectTime + 500){
            this.effectTime = lastTimestamp
        }else{
            return
        }

        var color = 'red'
        if(this.bad_status.burn > 0){
            var p = players.find(element => element.id == this.bad_status.burn_id)
            var mult = elementalCalc(this.bad_status, 'rod_fire')
            var result = Math.round((m_attack_vs_m_defense(p.attributes_values.m_attack, p.attributes.dexterity, this.attributes_values.m_defense) * 0.2) * mult)
            this.attributes_values.hp -= result
            if(this.attributes_values.hp < 0){
                this.attributes_values.hp = 0 
            }
            var display = new Display({x : this.position.x + this.width/2, y : this.position.y + this.height/2, 
                color : color, text : result, type : 'damage'})
            displays.push(display) 
            sendDamage(player.id, result, null, null, 0, 0)
        }

        if(this.bad_status.electrification > 0){
            var p = players.find(element => element.id == this.bad_status.electrification_id)
            var mult = elementalCalc(this.bad_status, 'rod_eletric')
            var result = Math.round((m_attack_vs_m_defense(p.attributes_values.m_attack, p.attributes.dexterity, this.attributes_values.m_defense) * 0.2) * mult)
            this.attributes_values.hp -= result
            if(this.attributes_values.hp < 0){
                this.attributes_values.hp = 0 
            }
            var display = new Display({x : this.position.x + this.width/2, y : this.position.y + this.height/2, 
                color : color, text : result, type : 'damage'})
            displays.push(display) 
            sendDamage(player.id, result, null, null, 0, 0)
        }

        if(this.bad_status.cold > 0 || this.bad_status.petrification > 0 || this.bad_status.stun > 0){
            this.state.walking = false
            this.state.running = false
            keyCodeUp(38)
            keyCodeUp(40)
            keyCodeUp(37)
            keyCodeUp(39)
            active_control = false
        }else{
            active_control = true
        }        
    }

    setAttributesValues(){

        var attributes = {
            power : this.attributes.power,
            agility : this.attributes.agility,
            dexterity : this.attributes.dexterity,
            vitality : this.attributes.vitality,
            inteligence : this.attributes.inteligence
        }
        switch(this.gender){
            case 'male':
                attributes.power *= 1.1
                attributes.vitality *= 1.1               
            break

            case 'female':
                attributes.agility *= 1.1
                attributes.inteligence *= 1.1
            break

            default:
                console.log('Gender is not defined')
        }
            
        var class_bonus_power = 1
        var class_bonus_agility = 1
        var class_bonus_dexterity = 1
        var class_bonus_vitality = 1
        var class_bonus_inteligence = 1
        var class_bonus_hp = 1
        var class_bonus_sp = 1
        var class_bonus_hp_sum = 0
        var class_bonus_sp_sum = 0

        switch(this.character_class){
            case 'knight':
                class_bonus_power = 1.15
                class_bonus_vitality = 1.2
                class_bonus_hp = 1.25

                class_bonus_hp_sum = 40
                class_bonus_sp_sum = 4
            break

            case 'wizzard':
                class_bonus_inteligence = 1.2
                class_bonus_dexterity = 1.1
                class_bonus_sp = 1.25

                class_bonus_hp_sum = 22
                class_bonus_sp_sum = 18
            break

            case 'mage':
                class_bonus_inteligence = 1.1
                class_bonus_dexterity = 1.2
                class_bonus_sp = 1.25

                class_bonus_hp_sum = 20
                class_bonus_sp_sum = 20
            break

            case 'archer':
                class_bonus_power = 1.1
                class_bonus_dexterity = 1.15
                class_bonus_agility = 1.1

                class_bonus_hp_sum = 25
                class_bonus_sp_sum = 15
            break

            case 'squire':
                class_bonus_power = 1.1
                class_bonus_vitality = 1.3
                class_bonus_hp = 1.2

                class_bonus_hp_sum = 30
                class_bonus_sp_sum = 20
            break
        }

        this.attributes_values.max_hp = class_bonus_hp_sum +Math.round(hp_value(attributes.vitality, 1) * class_bonus_hp)
        this.attributes_values.max_sp = class_bonus_sp_sum + Math.round(sp_value(attributes.inteligence, attributes.dexterity) * class_bonus_sp)

        this.attributes_values.hp = this.attributes_values.max_hp
        this.attributes_values.sp = this.attributes_values.max_sp
        this.attributes_values.stamina = this.attributes_values.max_stamina
        
        this.attributes_values.attack = attack_value(attributes.power * class_bonus_power, attributes.dexterity)
        this.attributes_values.defense = defense_value(attributes.vitality * class_bonus_vitality, attributes.power)
        this.attributes_values.flee = flee_value(attributes.agility * class_bonus_agility, 1)
        this.attributes_values.accuracy = accuracy_value(1, attributes.dexterity * class_bonus_dexterity)
        this.attributes_values.knock_back = knock_back(0, attributes.power, 1)

        this.attributes_values.m_attack = m_attack_value(attributes.inteligence * class_bonus_inteligence, attributes.dexterity * class_bonus_dexterity)
        this.attributes_values.m_defense = m_defense_value(attributes.inteligence * class_bonus_inteligence, attributes.dexterity)
        
        this.attributes_values.speed = speed_value(attributes.agility * class_bonus_agility) 
        this.attributes_values.attack_speed = attack_speed_value(attributes.agility * class_bonus_agility)
        this.attributes_values.hp_recovery = hp_recovery(attributes.vitality * class_bonus_vitality)   
        this.attributes_values.sp_recovery = sp_recovery(attributes.inteligence * class_bonus_inteligence, attributes.dexterity * 0.1) 
    }

    setGender(){
        
        this.currentCropWidth = 33
        this.currentCropHeight = 0

        this.sprites = {
            character : {
                sprite : createImage('src/image/class_undefined.png'),
                width : 32,
                height : 43,
                cropWidth : 32,
                cropHeight : 43
            },
            shield : {
                sprite : createImage('src/image/shield_undenfined.png'),
                cropWidth : 45,
                width : 45
            }
        } 

        if(this.gender=='male'){
            switch(this.character_class){
                case 'knight':
                    this.sprites.character.sprite = createImage('src/image/class_knight_male.png')
                    this.sprites.shield.sprite = createImage('src/image/shield_1.png')
                break

                case 'wizzard':
                    this.sprites.character.sprite = createImage('src/image/class_wizzard_male.png')
                break

                case 'mage':
                    this.sprites.character.sprite = createImage('src/image/class_mage_male.png')
                break

                case 'archer':
                    this.sprites.character.sprite = createImage('src/image/class_archer_male.png')
                break

                case 'squire':
                    this.sprites.character.sprite = createImage('src/image/class_squire_male.png')
                    this.sprites.shield.sprite = createImage('src/image/shield_2.png')
                break
            }
        }

        if(this.gender=='female'){
            switch(this.character_class){
                case 'knight':
                    this.sprites.character.sprite = createImage('src/image/class_knight_female.png')
                    this.sprites.shield.sprite = createImage('src/image/shield_1.png')
                break

                case 'wizzard':
                    this.sprites.character.sprite = createImage('src/image/class_wizzard_female.png')
                break

                case 'mage':
                    this.sprites.character.sprite = createImage('src/image/class_mage_female.png')
                break

                case 'archer':
                    this.sprites.character.sprite = createImage('src/image/class_archer_female.png')
                break

                case 'squire':
                    this.sprites.character.sprite = createImage('src/image/class_squire_female.png')
                    this.sprites.shield.sprite = createImage('src/image/shield_2.png')
                break
            }
        }

        switch(this.character_class){
            case 'knight':
                this.skill.primary_weapon_type = 'dagger'                    
                this.skill.secondary_weapon_type = 'sword_2'
                this.skill.spell_type_1 = 'power_blade'
                this.skill.spell_type_2 = 'ghost_blade'
                this.skill.spell_type_3 = 'phanton_blade'
                this.skill.spell_type_4 = 'sword_reinforce'
            break

            case 'wizzard':
                this.skill.primary_weapon_type = 'rod'                    
                this.skill.secondary_weapon_type = 'rod'
                this.skill.spell_type_1 = 'rod_ice'
                this.skill.spell_type_2 = 'rod_lava'
                this.skill.spell_type_3 = 'rod_stone'
                this.skill.spell_type_4 = 'rod_eletric'
            break

            case 'mage':
                this.skill.primary_weapon_type = 'rod'
                this.skill.secondary_weapon_type = 'rod'
                this.skill.spell_type_1 = 'rod_water'
                this.skill.spell_type_2 = 'rod_fire'
                this.skill.spell_type_3 = 'rod_earth'
                this.skill.spell_type_4 = 'rod_wind'
            break

            case 'archer':
                this.skill.primary_weapon_type = 'dagger'
                this.skill.secondary_weapon_type = 'arrow'
                this.skill.spell_type_1 = 'arrow_fire'
                this.skill.spell_type_2 = 'arrow_pierce'
                this.skill.spell_type_3 = 'arrow_triple'
                this.skill.spell_type_4 = ''
            break

            case 'squire':
                this.skill.primary_weapon_type = 'dagger'
                this.skill.secondary_weapon_type = 'sword_1'
                this.skill.spell_type_1 = 'rapid_blade'
                this.skill.spell_type_2 = 'shield_reinforce'
                this.skill.spell_type_3 = 'shield_reflect'
                this.skill.spell_type_4 = 'damage_transfer'
            break
        }
    }

    debug(){
        //player area
        context.fillStyle = '#ff000088'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)  

        //info
        var square_info_width = 100
        var center_x = (this.position.x + this.width/2) - (square_info_width/2)
        
        context.fillStyle = '#'+this.color
        context.fillRect(center_x, this.position.y + this.height, square_info_width, 80) 

        context.font = "10px Arial Black"
        context.fillStyle = 'black'
        context.fillText('ID: '+this.id, center_x +2, this.position.y + 45) 

        context.font = "10px Arial Black"
        context.fillStyle = 'black'
        context.fillText('side: ' + this.state.side, center_x +2, this.position.y + 52)  

        context.font = "10px Arial Black"
        context.fillStyle = 'black'
        context.fillText('walking: ' + this.state.walking, center_x +2, this.position.y + 52 + 6)  

        context.font = "10px Arial Black"
        context.fillStyle = 'black'
        context.fillText('frames: ' + this.frame.frames, center_x +2, this.position.y + 52 + 12)  

        context.font = "10px Arial Black"
        context.fillStyle = 'black'
        context.fillText('running: ' + this.state.running, center_x +2, this.position.y + 52 + 12 +6) 

        context.font = "10px Arial Black"
        context.fillStyle = 'black'
        context.fillText('attacking: ' + this.state.attacking, center_x +2, this.position.y + 52 + 12 +12) 

        context.font = "10px Arial Black"
        context.fillStyle = 'black'
        context.fillText('defending: ' + this.state.defending, center_x +2, this.position.y + 52 + 12 +12+6)

        context.font = "10px Arial Black"
        context.fillStyle = 'black'
        context.fillText('stm_cdown: ' + this.cooldown.stamina, center_x +2, this.position.y + 52 + 12 +24)

        context.font = "10px Arial Black"
        context.fillStyle = 'black'
        context.fillText('atk_cdown: ' + this.cooldown.attack, center_x +2, this.position.y + 52 +24+12+6)

        context.font = "10px Arial Black"
        context.fillStyle = 'black'
        context.fillText('burn: ' + this.bad_status.burn, center_x +2, this.position.y + 52 +24+24)

        context.font = "10px Arial Black"
        context.fillStyle = 'black'
        context.fillText('cold: ' + this.bad_status.cold, center_x +2, this.position.y + 52 +24+24+6)

        context.font = "10px Arial Black"
        context.fillStyle = 'black'
        context.fillText('velocity.x: ' + this.velocity.x, center_x +2, this.position.y + 52 +24+24+12)

        context.font = "10px Arial Black"
        context.fillStyle = 'black'
        context.fillText('velocity.y: ' + this.velocity.y, center_x +2, this.position.y + 52 +24+24+18)

        context.font = "10px Arial Black"
        context.fillStyle = 'black'
        context.fillText('damage_transfer_id: ' + this.good_status.damage_transfer_id, center_x +2, this.position.y + 52 +24+24+18+6)
    }

    setMessage(text){        
        this.message.message = text   
        var time_length = text.length 
        if (time_length < 5){
            time_length = 5
        }
        this.message.time = 20 * time_length
    }

    //to synch the character frames with joystick axes 
    setFrameSpeed(){
        this.framespeed = 1
        // this.framespeed = this.attributes_values.speed
        // var vel_x = Math.abs(player.velocity.x)
        // var vel_y = Math.abs(player.velocity.y)
        // if(vel_x > 0.1 && vel_y < 0.1){
        //     this.framespeed = this.attributes_values.speed-vel_x
        // }else if(vel_x < 0.1 && vel_y > 0.1){
        //     this.framespeed = this.attributes_values.speed-vel_y
        // }else if(vel_x > 0.1 && vel_y > 0.1){
        //     if(vel_x > vel_y){
        //         var vel = (vel_x+(vel_y*0.293))
        //         if(this.attributes_values.speed < vel){vel=this.attributes_values.speed}
        //         if(vel < 0){vel=0}
        //         this.framespeed = this.attributes_values.speed-vel
        //     }else if(vel_x < vel_y){
        //         var vel = (vel_y+(vel_x*0.293))
        //         if(this.attributes_values.speed < vel){vel=this.attributes_values.speed}
        //         if(vel < 0){vel=0}
        //         this.framespeed = this.attributes_values.speed-vel
        //     }            
        // }
        // this.framespeed *= 3
        // if(this.framespeed < 0.5) this.framespeed = 0.5
    }    

    setBadStatus(damage_type){
        
    }

    setGoogStatus(damage_type){

        switch (damage_type){
            case 'shield_reinforce':
                this.good_status.shield_reinforce = status_duration('shield_reinforce')
            break

            case 'shield_reflect':
                this.good_status.shield_reflect = status_duration('shield_reflect')
            break

            case 'sword_reinforce':
                this.good_status.sword_reinforce = status_duration('sword_reinforce')
            break            
        }
        // switch (damage_type){
        //     case 'damage_transfer':
        //         this.good_status.damage_transfer = status_duration('damage_transfer')
        //     break
        // }             
    }
}