class Player{
    constructor(id, user_name, lastTimestamp, x, y, color, gender){
        this.id = id
        this.user_name = user_name
        this.start = false
        this.gender = gender
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

        this.frame = {
            frames : 4,
            frameTime : 0,
            standFrameTime : 500,    
            walkingFrameTime : 100,
            runningFrameTime : 0,      
            attackFrameTime : 150
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
            staminaCooldown : 0,
            attackCooldown : 0
        }

        this.attributes = {
            power : 12,
            agility : 10,
            dexterity : 12,
            vitality : 11,
            inteligence : 17
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
            
            speed : 3,
            attack_speed : -12,  
            hp_recovery : 0,    
            sp_recovery : 0   
        }

        this.setAttributesValues()

        this.color = color

        this.setGender()

        this.currentSprite = this.sprites.character.sprite

        this.currentShieldSprite = this.sprites.shield.sprite
        this.currentShieldCropWidth = 45

        this.message = {
            message : '',
            time : 0
        }
    }

    draw(){ 
        
        //this.debug()

        //draw shield first (up only)
        if(this.state.side == 'up' && this.state.defending){

            var posx = 0
            if(this.user_name == 'Kyo'){
                posx = -12
            }else{
                posx = -11
            }

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
        
        this.drawPlayerName()

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

        this.drawBars()

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

    update(){
        //sprite switching - player 1
        if(!this.state.attacking && this.state.walking){
            if(keys.right.pressed && lastKey === 'right'){
                this.state.side = 'right'
                this.currentCropHeight = this.sprites.character.cropHeight * 1
        
            } else if (keys.left.pressed && lastKey === 'left'){       
                this.state.side = 'left'
                this.currentCropHeight = this.sprites.character.cropHeight * 2
            
            } else if (keys.down.pressed && lastKey === 'down'){        
                this.state.side = 'down'
                this.currentCropHeight = this.sprites.character.cropHeight * 0
            
            } else if (keys.up.pressed && lastKey === 'up'){        
                this.state.side = 'up'
                this.currentCropHeight = this.sprites.character.cropHeight * 3
            }
        }

        this.updateSpritesOnTime()

        if(this.attributes_values.hp < this.attributes_values.max_hp && this.attributes_values.hp > 0){
            this.attributes_values.hp += this.attributes_values.hp_recovery
            if(this.attributes_values.hp > this.attributes_values.max_hp){
                this.attributes_values.hp = this.attributes_values.max_hp
            }
        }

        if(this.state.running){
            this.cooldown.staminaCooldown = 20
        }
        this.updateCooldowns()

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

    updateOther(){
        //sprite switching
        if(!this.state.attacking && this.state.walking){
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

        }

        this.updateSpritesOnTime()
    }

    updateSpritesOnTime(){
        if(lastTimestamp - this.frame.frameTime > this.lastTimestamp){
            this.frame.frames++            
            this.lastTimestamp = lastTimestamp
        }

        this.attributes_values.speed = speed_value(this.attributes.agility)
        //need adjust: stamina on timestamp
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

        //walk
        if (!this.state.attacking && this.state.walking){
            if(this.frame.frames > 3){
                this.frame.frames = 0
                if(this.state.running){
                    this.frame.frameTime = this.frame.runningFrameTime
                }else{
                    this.frame.frameTime = this.frame.walkingFrameTime
                }
                this.lastTimestamp = lastTimestamp
            }
            if(!(this.frame.frames >= 0 && this.frame.frames <= 3)){
                this.frame.frames = 0
                this.frame.frameTime = this.frame.walkingFrameTime
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

        if(this.attributes_values.stamina < this.attributes_values.max_stamina 
            && this.cooldown.staminaCooldown <= 0 && !this.state.running){
            this.attributes_values.stamina += 1
            if(this.attributes_values.stamina > this.attributes_values.max_stamina){
                this.attributes_values.stamina = this.attributes_values.max_stamina
            }
        }else{
            if(this.cooldown.staminaCooldown > 0){
                this.cooldown.staminaCooldown -= 1
            }
        }

        if(this.cooldown.attackCooldown > 0){
            this.cooldown.attackCooldown -= 1
        }
    }

    setAttributesValues(){

        this.attributes_values.max_hp = hp_value(this.attributes.vitality, this.attributes.power)
        this.attributes_values.max_sp = sp_value(this.attributes.inteligence, this.attributes.dexterity)

        this.attributes_values.hp = this.attributes_values.max_hp
        this.attributes_values.sp = this.attributes_values.max_sp
        this.attributes_values.stamina = this.attributes_values.max_stamina
        
        this.attributes_values.attack = attack_value(this.attributes.power, this.attributes.dexterity)
        this.attributes_values.defense = defense_value(this.attributes.vitality, this.attributes.dexterity)
        this.attributes_values.flee = flee_value(this.attributes.agility, this.attributes.dexterity)
        
        this.attributes_values.speed = speed_value(this.attributes.agility) 
        this.attributes_values.attack_speed = attack_speed_value(this.attributes.agility) + this.attributes_values.attack_speed
        this.attributes_values.hp_recovery = hp_recovery(this.attributes.vitality)   
        this.attributes_values.sp_recovery = sp_recovery(this.attributes.inteligence, this.attributes.dexterity) 
    }

    setGender(){
        switch(this.gender){
            case 'male':
                this.currentCropWidth = 34
                this.currentCropHeight = 0
    
                this.sprites = {
                    character : {
                        sprite : createImage('src/image/knight_male.png'),
                        width : 32,
                        height : 48,
                        cropWidth : 32,
                        cropHeight : 45
                    },
                    shield : {
                        sprite : createImage('src/image/shield_2.png'),
                        cropWidth : 45,
                        width : 45
                    }
                } 
            break

            case 'female':
                this.currentCropWidth = 33
                this.currentCropHeight = 0
    
                this.sprites = {
                    character : {
                        sprite : createImage('src/image/knight_female.png'),
                        width : 32,
                        height : 43,
                        cropWidth : 32,
                        cropHeight : 43
                    },
                    shield : {
                        sprite : createImage('src/image/shield_1.png'),
                        cropWidth : 45,
                        width : 45
                    }
                }
            break

            default:
                console.log('Gender is not defined')
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
        context.fillRect(center_x, this.position.y + this.height, square_info_width, 70) 

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
        context.fillText('stm_cdown: ' + this.cooldown.staminaCooldown, center_x +2, this.position.y + 52 + 12 +24)

        context.font = "10px Arial Black"
        context.fillStyle = 'black'
        context.fillText('atk_cdown: ' + this.cooldown.attackCooldown, center_x +2, this.position.y + 52 +24+12+6)
    }

    setMessage(text){        
        this.message.message = text   
        var time_length = text.length 
        if (time_length < 5){
            time_length = 5
        }
        this.message.time = 20 * time_length
    }
}