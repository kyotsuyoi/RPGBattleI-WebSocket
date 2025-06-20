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

        this.character_size={
            width : character_width,
            height : character_height
        }

        this.width = 42
        this.height = 42
        this.targetRange = 150 

        this.lastDamage = new Array() //saves id of target that has already taken damage

        this.frameTime = 50
        this.frames = 0
        this.max_frames = 3
        this.damageCount = 1//for mult damages
        this.lastTimestamp = lastTimestamp
        this.positionTimestamp = lastTimestamp
        this.finished = false
        this.isKnockBack = true //enable or disable knock back
        this.isSoundPlayed = false
        this.magic = false

        this.owner = owner
        this.owner_id = owner_id

        this.sprites = {
            sprite : createImage('')             
        }        

        this.type = type   
        switch (type){
            case 'power_blade':
                this.width = 80
                this.height = 80

                this.power = 40
                this.attack_percentage = 250
                this.bonus_dexterity = 5
                this.time = 60
                this.count_time = 0  
                this.speed = 1.5
                this.stun = 10  
                this.coolDown = 22
                this.sp_value = 40

                this.sprites.sprite = createImage('src/image/attack_power_sword.png')
                this.sprites.width = 80
                this.sprites.height = 80
                this.sprites.currentCropWidth = 36
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 36
                this.sprites.cropHeight = 36

                this.max_frames = 7
            break

            case 'rapid_blade':
                this.width = 50
                this.height = 50

                this.power = 3
                this.attack_percentage = 140
                this.bonus_dexterity = 3
                this.time = 10
                this.count_time = 0  
                this.damageCount = 3
                this.speed = 2.5
                this.stun = 5    
                this.coolDown = 18
                this.sp_value = 35

                this.sprites.sprite = createImage('src/image/attack_power_sword.png')
                this.sprites.width = 50
                this.sprites.height = 50
                this.sprites.currentCropWidth = 36
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 36
                this.sprites.cropHeight = 36

                this.max_frames = 7
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
                this.stun = 5  
                this.coolDown = 30
                this.sp_value = 25

                this.isKnockBack = true

                this.sprites.sprite = createImage('src/image/attack_power_sword.png')
                this.sprites.width = 50
                this.sprites.height = 50
                this.sprites.currentCropWidth = 36
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 36
                this.sprites.cropHeight = 36

                this.max_frames = 7
            break
            
            case 'phanton_blade':
                this.width = 80
                this.height = 80

                this.power = 0
                this.attack_percentage = 70
                this.bonus_dexterity = 10
                this.time = 80  
                this.count_time = 0                
                this.damageCount = 30
                this.speed = 0
                this.stun = 8    
                this.coolDown = 55
                this.sp_value = 30

                this.isKnockBack = false

                this.sprites.sprite = createImage('src/image/attack_circular_fire.png')
                this.sprites.width = 80
                this.sprites.height = 80     
                this.sprites.currentCropWidth = 36
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 36
                this.sprites.cropHeight = 36

                this.max_frames = 7
            break

            case 'sword_reinforce':
                this.width = 45
                this.height = 45

                this.power = 0 
                this.time = 50   
                this.count_time = 0            
                this.damageCount = 0
                this.speed = 0
                this.stun = 0    
                this.coolDown = 80
                this.sp_value = 100      
                
                this.isKnockBack = false

                this.sprites.sprite = createImage('src/image/icon_sword_reinforce.png')        
                this.sprites.width = 45
                this.sprites.height = 45     
                this.sprites.currentCropWidth = 45
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 45
                this.sprites.cropHeight = 45
            break

            case 'shield_reinforce':
                this.width = 45
                this.height = 45

                this.power = 0 
                this.time = 50   
                this.count_time = 0            
                this.damageCount = 0
                this.speed = 0
                this.stun = 0    
                this.coolDown = 50
                this.sp_value = 50      
                
                this.isKnockBack = false

                this.sprites.sprite = createImage('src/image/shield_1.png')        
                this.sprites.width = 45
                this.sprites.height = 45     
                this.sprites.currentCropWidth = 45
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 45
                this.sprites.cropHeight = 45
            break

            case 'shield_reflect':
                this.width = 45
                this.height = 45

                this.power = 0 
                this.time = 50   
                this.count_time = 0            
                this.damageCount = 0
                this.speed = 0
                this.stun = 0    
                this.coolDown = 100
                this.sp_value = 90      
                
                this.isKnockBack = false

                this.sprites.sprite = createImage('src/image/shield_2.png')        
                this.sprites.width = 45
                this.sprites.height = 45     
                this.sprites.currentCropWidth = 45
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 45
                this.sprites.cropHeight = 45
            break
            
            case 'damage_transfer':
                this.width = 50
                this.height = 50

                this.power = 0 
                this.attack_percentage = 0
                this.bonus_dexterity = 0
                this.time = 200   
                this.count_time = 1           
                this.damageCount = 0
                this.speed = 1.5
                this.stun = 0    
                this.coolDown = 100
                this.sp_value = 20   

                this.good_status = 'damage_transfer'
                this.isKnockBack = false             

                this.sprites.sprite = createImage('src/image/skill_damage_transfer.png')        
                this.sprites.width = 50
                this.sprites.height = 50     
                this.sprites.currentCropWidth = 42
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 42
                this.sprites.cropHeight = 42
            break
            
            case 'rod_water':
                this.width = 50
                this.height = 50

                this.power = 0 
                this.attack_percentage = 140
                this.bonus_dexterity = 3
                this.time = 200   
                this.count_time = 1           
                this.damageCount = 0
                this.speed = 1.5
                this.stun = 0    
                this.coolDown = 30
                this.sp_value = 25    
                
                this.bad_status = 'wet'
                this.magic = true
                
                this.isKnockBack = false

                this.sprites.sprite = createImage('src/image/attack_water.png')        
                this.sprites.width = 50
                this.sprites.height = 50     
                this.sprites.currentCropWidth = 42
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 42
                this.sprites.cropHeight = 42
            break

            case 'rod_ice':
                this.width = 50
                this.height = 50

                this.power = 0 
                this.attack_percentage = 140
                this.bonus_dexterity = 3
                this.time = 200   
                this.count_time = 1           
                this.damageCount = 0
                this.speed = 1.5
                this.stun = 0    
                this.coolDown = 30
                this.sp_value = 25    
                
                this.bad_status = 'cold'
                this.magic = true
                
                this.isKnockBack = false

                this.sprites.sprite = createImage('src/image/attack_ice.png')        
                this.sprites.width = 50
                this.sprites.height = 50     
                this.sprites.currentCropWidth = 42
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 42
                this.sprites.cropHeight = 42
            break

            case 'rod_fire':
                this.width = 50
                this.height = 50

                this.power = 0 
                this.attack_percentage = 140
                this.bonus_dexterity = 3
                this.time = 200   
                this.count_time = 1           
                this.damageCount = 0
                this.speed = 1.5
                this.stun = 0    
                this.coolDown = 30
                this.sp_value = 25   
                
                this.bad_status = 'heat'
                this.magic = true
                
                this.isKnockBack = false                

                this.sprites.sprite = createImage('src/image/attack_fire.png')        
                this.sprites.width = 50
                this.sprites.height = 50     
                this.sprites.currentCropWidth = 42
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 42
                this.sprites.cropHeight = 42
            break
            
            case 'rod_lava':
                this.width = 50
                this.height = 50

                this.power = 0 
                this.attack_percentage = 140
                this.bonus_dexterity = 3
                this.time = 200   
                this.count_time = 1           
                this.damageCount = 0
                this.speed = 1.5
                this.stun = 0    
                this.coolDown = 30
                this.sp_value = 25    
                
                this.bad_status = 'burn'
                this.magic = true
                
                this.isKnockBack = false

                this.sprites.sprite = createImage('src/image/attack_lava.png')        
                this.sprites.width = 50
                this.sprites.height = 50     
                this.sprites.currentCropWidth = 42
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 42
                this.sprites.cropHeight = 42
            break

            case 'rod_wind':
                this.width = 56
                this.height = 56

                this.power = 0 
                this.attack_percentage = 100
                this.bonus_dexterity = 5
                this.time = 60   
                this.count_time = 0   
                this.damageCount = 6
                this.speed = 0.8
                this.stun = 0    
                this.coolDown = 40
                this.sp_value = 40    
                
                this.bad_status = 'breeze'
                this.magic = true
                
                this.isKnockBack = false

                this.sprites.sprite = createImage('src/image/attack_wind.png')        
                this.sprites.width = 56
                this.sprites.height = 56     
                this.sprites.currentCropWidth = 56
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 56
                this.sprites.cropHeight = 56
            break

            case 'rod_eletric':
                this.width = 56
                this.height = 56

                this.power = 0 
                this.attack_percentage = 100
                this.bonus_dexterity = 5
                this.time = 60   
                this.count_time = 0   
                this.damageCount = 6
                this.speed = 0.8
                this.stun = 0    
                this.coolDown = 40
                this.sp_value = 40    
                
                this.bad_status = 'electrification'
                this.magic = true
                
                this.isKnockBack = false

                this.sprites.sprite = createImage('src/image/attack_thunder.png')        
                this.sprites.width = 60.5
                this.sprites.height = 60     
                this.sprites.currentCropWidth = 60.5
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 60.5
                this.sprites.cropHeight = 60

                this.max_frames = 9
            break

            case 'rod_earth':
                this.width = 42
                this.height = 42

                this.power = 0 
                this.attack_percentage = 140
                this.bonus_dexterity = 3
                this.time = 200   
                this.count_time = 1           
                this.damageCount = 0
                this.speed = 1.5
                this.stun = 0    
                this.coolDown = 30
                this.sp_value = 25   
                
                this.bad_status = 'dirty'
                this.magic = true
                
                this.isKnockBack = false                

                this.sprites.sprite = createImage('src/image/attack_earth.png')        
                this.sprites.width = 42
                this.sprites.height = 42     
                this.sprites.currentCropWidth = 42
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 42
                this.sprites.cropHeight = 42
            break

            case 'rod_stone':
                this.width = 42
                this.height = 42

                this.power = 0 
                this.attack_percentage = 140
                this.bonus_dexterity = 3
                this.time = 200   
                this.count_time = 1           
                this.damageCount = 0
                this.speed = 1.5
                this.stun = 0    
                this.coolDown = 30
                this.sp_value = 25   
                
                this.bad_status = 'petrification'
                this.magic = true
                
                this.isKnockBack = false                

                this.sprites.sprite = createImage('src/image/attack_stone.png')        
                this.sprites.width = 42
                this.sprites.height = 42     
                this.sprites.currentCropWidth = 42
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 42
                this.sprites.cropHeight = 42
            break

            case 'shield_magic':
                this.width = 80
                this.height = 80

                this.power = 0
                this.attack_percentage = 70
                this.bonus_dexterity = 10
                this.time = 80  
                this.count_time = 0                
                this.damageCount = 30
                this.speed = 0
                this.stun = 0    
                this.coolDown = 120
                this.sp_value = 30

                this.isKnockBack = false

                this.sprites.sprite = createImage('src/image/shield_magic.png')
                this.sprites.width = 80
                this.sprites.height = 80     
                this.sprites.currentCropWidth = 36
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 36
                this.sprites.cropHeight = 36

                this.max_frames = 7
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

            case 'dagger':
                this.width = this.width
                this.height = this.height  

                this.power = 5
                this.time = 4  
                this.count_time = 0
                this.attack_percentage = 80
                this.bonus_dexterity = 5               
                this.speed = 4
                this.stun = 0

                this.sprites.sprite = createImage('src/image/attack_sword.png')  
                this.sprites.width = 42
                this.sprites.height = 42
                this.sprites.currentCropWidth = 42
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 42
                this.sprites.cropHeight = 42
            break

            case 'rod':
                this.width = this.width
                this.height = this.height  

                this.power = 4
                this.time = 8
                this.count_time = 0
                this.attack_percentage = 60
                this.bonus_dexterity = 6              
                this.speed = 4
                this.stun = 0

                this.sprites.sprite = createImage('src/image/attack_sword.png')  
                this.sprites.width = 42
                this.sprites.height = 42
                this.sprites.currentCropWidth = 42
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 42
                this.sprites.cropHeight = 42
            break

            case 'arrow':
                this.width = this.width
                this.height = this.height  

                this.power = 2
                this.time = 60
                this.count_time = 1
                this.attack_percentage = 100
                this.bonus_dexterity = 0      
                this.speed = 5
                this.stun = 0

                this.sprites.sprite = createImage('src/image/attack_arrow.png')  
                this.sprites.width = 42
                this.sprites.height = 42
                this.sprites.currentCropWidth = 42
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 42
                this.sprites.cropHeight = 42

                this.max_frames = 0
            break

            case 'arrow_fire':
                this.width = 50
                this.height = 50

                this.power = 4
                this.attack_percentage = 140
                this.bonus_dexterity = 3
                this.time = 40   
                this.count_time = 1           
                this.damageCount = 0
                this.speed = 7
                this.stun = 0    
                this.coolDown = 40
                this.sp_value = 20   
                
                this.bad_status = 'burn'             

                this.sprites.sprite = createImage('src/image/attack_arrow_fire.png')        
                this.sprites.width = 50
                this.sprites.height = 50     
                this.sprites.currentCropWidth = 42
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 42
                this.sprites.cropHeight = 42
            break

            case 'arrow_pierce':
                this.width = 50
                this.height = 50

                this.power = 4
                this.attack_percentage = 130
                this.bonus_dexterity = 5
                this.time = 25   
                this.count_time = 2          
                this.damageCount = 2
                this.speed = 8
                this.stun = 0    
                this.coolDown = 60
                this.sp_value = 40                             

                this.sprites.sprite = createImage('src/image/attack_arrow_pierce.png')        
                this.sprites.width = 50
                this.sprites.height = 50     
                this.sprites.currentCropWidth = 42
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 42
                this.sprites.cropHeight = 42
            break

            case 'arrow_triple':
                this.width = 50
                this.height = 50

                this.power = 2
                this.attack_percentage = 120
                this.bonus_dexterity = 3
                this.time = 30
                this.count_time = 0
                this.damageCount = 3
                this.speed = 5
                this.stun = 1   
                this.coolDown = 60
                this.sp_value = 40                             

                this.sprites.sprite = createImage('src/image/attack_arrow_pierce.png')        
                this.sprites.width = 50
                this.sprites.height = 50     
                this.sprites.currentCropWidth = 42
                this.sprites.currentCropHeight = 0
                this.sprites.cropWidth = 42
                this.sprites.cropHeight = 42
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
                this.stun = 0

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
        if(type == 'phanton_blade' || type == 'cure' || type == 'shield_reinforce' || type == 'shield_reflect' || type == 'sword_reinforce'){
            this.position.x = x - this.width/2 + this.character_size.width /2
            this.position.y = (y + character_height /2) - (this.height/2) 
            this.sprites.currentCropHeight = 0

        }else{
            this.velocity_side()
        }       
    }

    draw(){

        //this.debug()

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

        context.save()
        context.globalAlpha = 0.8

        //to set default
        var drow_side = this.side
        if(this.type == 'rod_wind' || this.type == 'rod_eletric' || this.type == 'rod_lava' || this.type == 'rod_water'){
            drow_side = 'right'
        }
        switch (drow_side){            
            case 'right':
                //default
                this.center_y-=10
            break

            case 'left':
                context.translate(this.position.x + this.width/2, this.position.y + this.height/2)
                context.rotate(180 * Math.PI/180)
                context.translate(-this.position.x - this.width/2, -this.position.y  - this.height/2)
                this.center_y+=10
            break

            case 'up':
                context.translate(this.position.x + this.width/2, this.position.y + this.height/2)
                context.rotate(270 * Math.PI/180)
                context.translate(-this.position.x - this.width/2, -this.position.y  - this.height/2)
                this.center_x+=10
            break

            case 'down':
                context.translate(this.position.x + this.width/2, this.position.y + this.height/2)
                context.rotate(90 * Math.PI/180)
                context.translate(-this.position.x - this.width/2, -this.position.y  - this.height/2)
                this.center_x-=10
            break
        }
        context.drawImage(          
            this.currentSprite, 
            this.sprites.currentCropWidth * this.frames, //corte no eixo x
            0, //corte no eixo y
            this.sprites.cropWidth, //largura do corte
            this.sprites.cropHeight, //altura do corte
            this.center_x, 
            this.center_y,
            this.sprites.width,
            this.sprites.height
        )
        context.restore()
    }

    update(){
        if(lastTimestamp - this.frameTime > this.lastTimestamp){
            this.frames++            
            this.lastTimestamp = lastTimestamp
        }

        if(this.frames > this.max_frames){            
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
        context.fillStyle = 'red'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    velocity_side(){
        switch (this.side){
            case 'up':
                this.position.x = (this.position.x + this.character_size.width /2) - (this.height/2)
                this.position.y = this.position.y - this.height/2 + this.character_size.height /2//- this.width //- this.height
                this.sprites.currentCropHeight = this.sprites.cropHeight*2
                this.velocity.y = -this.speed                
                this.velocity.x = 0
            break

            case 'down':
                this.position.x = (this.position.x + this.character_size.width /2) - (this.height/2)
                this.position.y = this.position.y - this.height/2 + this.character_size.height /2 //+ character_height 
                this.sprites.currentCropHeight = this.sprites.cropHeight*3
                this.velocity.y = this.speed             
                this.velocity.x = 0
            break

            case 'left':
                this.position.x = this.position.x - this.width/2 + this.character_size.width /2//- this.width
                this.position.y = (this.position.y + this.character_size.height /2) - (this.height/2) 
                this.sprites.currentCropHeight = 0
                this.velocity.x = -this.speed             
                this.velocity.y = 0
            break

            case 'right':
                this.position.x = this.position.x - this.width/2 + this.character_size.width /2//+ character_width 
                this.position.y = (this.position.y + this.character_size.height /2) - (this.height/2)
                this.sprites.currentCropHeight = this.sprites.cropHeight
                this.velocity.x = this.speed             
                this.velocity.y = 0
            break
        }
    }
} 

function damage_action(damage){
    if(damage.count_time <= 0){
        
        switch(damage.type){

            case 'rapid_blade':
                if(damage.damageCount > 1){
                    damage.lastDamage = new Array()
                    damage.damageCount -= 1
                    damage.count_time = damage.time
                }else{
                    damage.finished = true
                }  
            break

            case 'ghost_blade':
                if(damage.damageCount > 1){
                    damage.lastDamage = new Array()
                    damage.damageCount -= 1
                    damage.count_time = damage.time
                }else{
                    damage.finished = true
                }  
            break

            case 'phanton_blade':
                if(damage.damageCount > 1){
                    damage.lastDamage = new Array()
                    damage.damageCount -= 1
                    damage.count_time = 5
                    //damage.stun = 5
                }else{
                    damage.finished = true
                } 
            break

            case 'cure':
                if(damage.damageCount > 1){ 
                    damage.lastDamage = new Array()
                    damage.damageCount -= 1
                    damage.count_time = damage.time
                }else{ 
                    damage.finished = true
                } 
            break

            case 'arrow':
                if(damage.damageCount > 1){ 
                    damage.lastDamage = new Array()
                    damage.damageCount -= 1
                    damage.count_time = damage.time
                }else{ 
                    damage.finished = true
                } 
            break

            case 'arrow_triple':
                if(damage.damageCount > 1){
                    damage.lastDamage = new Array()
                    damage.damageCount -= 1
                    damage.count_time = damage.time
                }else{
                    damage.finished = true
                } 
            break

            default:
                if(damage.damageCount > 1){
                    damage.lastDamage = new Array()
                    damage.damageCount -= 1
                    damage.count_time = damage.time
                }else{
                    damage.finished = true
                } 
        }

    }else{
        damage.count_time -= 1
        if(damage.owner == 'player'){

            //Do not execute damage if damage owner is the player
            if (damage.owner_id !== player.id){
                return
            }  

            var inteligence = player.attributes.inteligence            

            if(damage.type == 'cure'){
                playerCure(damage, player, inteligence)            
            }else{
                playerDamagePlayer(damage)                
            }
        }  
    }
}

// function enemyDamage(damage, player){

//     if(player == null){
//         return
//     }
    
//     if (square_colision_area(damage, player)) {
          
//         //If enemy is dead
//         var enemy = enemies.find(element => element.id == damage.owner_id)
//         if(enemy == undefined){
//             //console.log('undefined enemy')
//             return
//         } 

//         //if the player has already been hit
//         var id = damage.lastDamage.filter(element => element == player.id)
//         if(id == 'p1' || id == 'p2'){
//             return
//         }
//         damage.lastDamage.push(player.id)          

//         var is_hit = dexterity_vs_flee(enemy.attributes.dexterity, player.attributes.agility)            
//         if(player.state.defending){
//             is_hit = true
//         }

//         if(is_hit){   

//             var result = attack_vs_defense(enemy.attributes_values.attack, enemy.attributes.dexterity, player.attributes_values.defense)
//             if(player.state.defending){ 

//                 res_stm = player.attributes_values.stamina - result
//                 if(res_stm < 0){
//                     player.attributes_values.stamina = 0 
//                     player.state.defending = false
//                     //result += Math.round(res_stm)
//                     //result += res_stm
//                     player.attributes_values.hp += res_stm  
//                     if(player.attributes_values.hp <= 0){
//                         player.attributes_values.hp = 0.0
//                     }                       
//                     swordSlashSound()  
//                     display = new Display({x : player.position.x + player.width/2, y : player.position.y + player.height/2, color : 'red', text : result, type : 'damage'})
//                     displays.push(display)                     

//                 }else{
//                     shieldSound()
//                     player.attributes_values.stamina = player.attributes_values.stamina - stamina_vs_attack(result)
//                     //damages.pop(damage)
//                     if(damage.type==''){  
//                         damage.finished = true
//                     }
//                 }  
                
//                 player.stamina.staminaCooldown = 50

//             }else{
//                 player.attributes_values.hp -= result  
//                 if(player.attributes_values.hp < 0){
//                     player.attributes_values.hp = 0
//                 }                  
//                 swordSlashSound()          
//                 display = new Display({x : player.position.x + player.width/2, y : player.position.y + player.height/2, color : 'red', text : result, type : 'damage'})
//                 displays.push(display)
//             }
            
//             var knock_val = knock_back(damage.power, enemy.attributes.power, player.attributes.power)
//             if(damage.isKnockBack){
//                 switch (damage.side){
//                     case 'up': 
//                         if(player.position.y - knock_val <= 0){
//                             player.position.y = 0
//                         }else{
//                             player.position.y -= knock_val
//                         }                      
//                     break
    
//                     case 'down':
//                         if(player.position.y + player.height + knock_val >= background.height){
//                             player.position.y = background.height - player.height
//                         }else{
//                             player.position.y += knock_val
//                         }
//                     break
    
//                     case 'left':
//                         if(player.position.x - knock_val <= 0){
//                             player.position.x = 0
//                         }else{
//                             player.position.x -= knock_val
//                         }
//                     break
    
//                     case 'right':
//                         if(player.position.x + player.width + knock_val >= background.width){
//                             player.position.x = background.width - player.width
//                         }else{
//                             player.position.x += knock_val
//                         }
//                     break                    
//                 }
//             }

//         }else{
//             display = new Display({x : player.position.x + player.width/2, y : player.position.y + player.height/2, color : 'yellow', text : 'MISS', type : 'damage'})
//             displays.push(display)
//         }  

//         if(player.attributes_values.hp <= 0){
//             return
//         }
//     }
// }

// function playerDamage(damage){
//     enemies.forEach(enemy => {
//         if(damage.owner == 'cpu'){
//             console.log('wrong damage detected')
//         }
//         if (square_colision_area(damage, enemy)) {
            
//             //this is to not double damage
//             var p = damage.lastDamage.filter(element => element == enemy.id)
//             if(p == enemy.id){
//                 return
//             }
//             damage.lastDamage.push(enemy.id)
            
//             var is_hit = false
//             switch(damage.owner_id){
//                 case 'p1':
//                     is_hit = dexterity_vs_flee(player.attributes.dexterity + damage.bonus_dexterity, enemy.attributes.agility)
//                 break
//                 case 'p2':
//                     is_hit = dexterity_vs_flee(player.attributes.dexterity + damage.bonus_dexterity, enemy.attributes.agility)
//                 break
//             }                    
            
//             if(is_hit){                        
//                 var result = 0
//                 switch(damage.owner_id){
//                     case 'p1':
//                         result = attack_vs_defense(
//                             player.attributes_values.attack * damage.attack_percentage / 100, 
//                             player.attributes.dexterity + damage.bonus_dexterity, 
//                             enemy.attributes_values.defense
//                         )
//                     break
//                     case 'p2':
//                         result = attack_vs_defense(
//                             player2.attributes_values.attack * damage.attack_percentage / 100, 
//                             player2.attributes.dexterity + damage.bonus_dexterity, 
//                             enemy.attributes_values.defense
//                         )
//                     break
//                 }  

//                 enemy.attributes_values.hp -= result   
//                 enemy.stunTime = damage.stun  

//                 if(!damage.isSoundPlayed){
//                     swordSlashSound() 
//                     damage.isSoundPlayed = true 
//                 }    

//                 if(enemy.attributes_values.hp <= 0){
//                     screamSound()
//                 }          
//                 display = new Display({x : enemy.position.x + enemy.width/2, y : enemy.position.y + enemy.height/2, color : 'red', text : result, type : 'damage'})
//                 displays.push(display)

//                 if(!enemy.knock_back || !damage.isKnockBack){
//                     return
//                 }

//                 var pl
//                 switch(damage.owner_id){
//                     case 'p1':
//                         pl = player
//                     break                      

//                     case 'p2':
//                         pl = player2
//                     break                             
//                 }

//                 var knock_val = knock_back(damage.power, pl.attributes.power, enemy.attributes.power)
//                 switch (damage.side){
//                     case 'up':   
                        
//                         if(enemy.position.y - knock_val <= 0){
//                             enemy.position.y = 0
//                         }else{                     
//                             enemy.position.y -= knock_val
//                         }
//                     break

//                     case 'down':
//                         if(enemy.position.y + enemy.height + knock_val >= background.height){
//                             enemy.position.y = background.height - enemy.height
//                         }else{
//                             enemy.position.y += knock_val
//                         }
//                     break

//                     case 'left':
//                         if(enemy.position.x - knock_val <= 0){
//                             enemy.position.x = 0
//                         }else{
//                             enemy.position.x -= knock_val
//                         }
//                     break

//                     case 'right':
//                         if(enemy.position.x + enemy.width + knock_val >= background.width){
//                             enemy.position.x = background.width - enemy.width
//                         }else{
//                             enemy.position.x += knock_val
//                         }
//                     break 
//                 }
//             }else{
//                 display = new Display({x : enemy.position.x + enemy.width/2, y : enemy.position.y + enemy.height/2, color : 'yellow', text : 'MISS', type : 'damage'})
//                 displays.push(display)
//             }    
//         }
//     }) 
// }

function playerDamagePlayer(damage){
    players.forEach(enemy => {
        if(damage.owner == undefined){
            console.log('wrong damage detected')
        }
        if(damage.type=='shield_reinforce' || damage.type=='shield_reflect' || damage.type=='sword_reinforce')return

        if (damage.owner_id != enemy.id && square_colision_area(damage, enemy)) {
            
            //this is to not double damage
            var p = damage.lastDamage.filter(element => element == enemy.id)
            if(p == enemy.id){
                return
            }
            damage.lastDamage.push(enemy.id)

            if(damage.type=='damage_transfer'){
                damage.finished = true                    
                sendDamageFinish(player.id, damage.id)
                sendGoodStatus(enemy.id, player.id, 'damage_transfer')
                return
            }
            
            var mult_dexterity = 1
            //20% dex bonus with sword_reinforce
            if(player.good_status.sword_reinforce > 0){
                mult_dexterity = 1.2
            }

            var is_hit = dexterity_vs_flee(
                (player.attributes.dexterity + damage.bonus_dexterity) * mult_dexterity, 
                enemy.attributes.agility
            )    
            
            if(damage.magic){
                //magic always hit
                is_hit = true
                magicDamageControl(damage, enemy)
                magicBadStatusConversion(damage, enemy)
            }
            
            if(is_hit){
                if (damage.type == 'arrow_fire') {
                    damage.finished = true                    
                    sendDamageFinish(player.id, damage.id)

                    if(status_chance(30)){
                        enemy.bad_status.burn = status_duration(damage.bad_status)
                        sendBadStatus(enemy.id, player.id, damage.type)
                    }  
                } 

                if (damage.type == 'arrow') {
                    damage.finished = true                    
                    sendDamageFinish(player.id, damage.id)
                } 

                defending_side_ok = false
                if (damage.side == 'up' && enemy.state.side == 'down' ||
                    damage.side == 'down' && enemy.state.side == 'up' ||
                    damage.side == 'left' && enemy.state.side == 'right' ||
                    damage.side == 'right' && enemy.state.side == 'left'){
                    defending_side_ok = true
                }

                //Reflect 100% damage with shield_reflect (not included bad status damage)
                if(enemy.good_status.shield_reflect > 0 && enemy.state.defending && defending_side_ok){   
                    result = resultDamageControl(damage, enemy)

                    display = new Display({x : player.position.x + enemy.width/2, y : player.position.y + 
                    player.height/2, color : 'red', text : result, type : 'damage'})
                    displays.push(display) 

                    var knock_val = knock_back(damage.power, player.attributes.power, enemy.attributes.power)
                    sendDamage(player.id, result, damage.side, 0, 0, damage.stun)
                    sendDamage(enemy.id, 0, damage.side, knock_val, stamina_result, damage.stun)
                    player.attributes_values.hp -= result  
                    if(player.attributes_values.hp < 0){
                        player.attributes_values.hp = 0
                    } 
                    swordSlashSound() 
                    return
                }
                
                var stamina_result = 0
                if(damage.magic){
                    stamina_result = stamina_vs_attack(enemy.attributes.power, player.attributes.inteligence)
                }else{
                    stamina_result = stamina_vs_attack(enemy.attributes.power, player.attributes.power)
                }

                result = resultDamageControl(damage, enemy)

                if(enemy.state.defending && enemy.attributes_values.stamina >= stamina_result && defending_side_ok){                    
    
                    shieldSound()
                    //Save 40% Stamina with shield_reinforce
                    if(enemy.good_status.shield_reinforce > 0){
                        stamina_result -= (stamina_result * 0.6)
                    }
                    enemy.attributes_values.stamina -= (enemy.attributes_values.stamina - stamina_result)
                    // if(damage.type==''){  
                    //     damage.finished = true
                    // }                 
                    result = 0  
                    
                    if (damage.type == 'arrow_pierce') {

                        if(status_chance(50)){
                            damage.side = reflect_arrow(enemy.state.side)                    
                            sendDamageUpdate(player.id, damage.id, damage.side)
                            damage.velocity_side()
                        }  
                    }
    
                }else{
                    enemy.attributes_values.hp -= result  
                    if(enemy.attributes_values.hp < 0){
                        enemy.attributes_values.hp = 0
                    }                  
                    swordSlashSound() 

                    stamina_result = 0
                }                   

                //2x damage for sword_reinforce
                if(player.good_status.sword_reinforce > 0){
                    result *= 2
                }

                //Save 40% HP with shield_reinforce
                if(enemy.good_status.shield_reinforce > 0){
                    result *= 0.6
                }

                if(!damage.isSoundPlayed){
                    //swordSlashSound() 
                    damage.isSoundPlayed = true 
                }    

                if(enemy.attributes_values.hp <= 0){
                    //screamSound()
                } 

                result = Math.round(result)
                if(result > 0){  
                    var target = enemy
                    if(enemy.good_status.damage_transfer > 0 && enemy.good_status.damage_transfer_id != player_id){
                        target = players.find(player => player.id == enemy.good_status.damage_transfer_id)
                        if(target == undefined){
                            target = enemy
                        }
                    }                 
                    display = new Display({x : target.position.x + target.width/2, y : target.position.y + 
                    target.height/2, color : 'red', text : result, type : 'damage'})
                    displays.push(display)
                }

                if(enemy.good_status.damage_transfer > 0){
                    sendDamage(enemy.good_status.damage_transfer_id, result, null, null, 0, 0)
                    result = 0
                }

                if(!damage.isKnockBack){                    
                    sendDamage(enemy.id, result, null, null, stamina_result, damage.stun)
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

                sendDamage(enemy.id, result, damage.side, knock_val, stamina_result, damage.stun)
                
            }else{
                display = new Display({x : enemy.position.x + enemy.width/2, y : enemy.position.y + enemy.height/2, color : 'yellow', text : 'MISS', type : 'damage'})
                displays.push(display)                
                sendDamage(enemy.id, 'MISS', null, null, 0, 0)
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

        //this is to not double cure        
        var id = damage.lastDamage.filter(element => element == player.id)
        if(id == player.id){
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
        sendRestore(player.id, Math.round(cure_value), 'area_cure')
    }
}

function activateGoodStatus(good_status, status_type, sender_id){
    switch(status_type){    
                
        case 'damage_transfer':            
            good_status.damage_transfer_id = sender_id
            good_status.damage_transfer = status_duration(status_type)
        break
    }

    return good_status
}

function activateBadStatus(bad_status, status_type, sender_id){
    switch(status_type){    
                
        case 'wet':
            bad_status.wet = status_duration(status_type)
            bad_status.cold = 0
            // bad_status.burn_id = 0
            // bad_status.burn = 0
            // bad_status.heat = 0
        break

        case 'cold':
            bad_status.cold = status_duration(status_type)
            bad_status.burn_id = 0
            bad_status.burn = 0
            bad_status.wet = 0
            bad_status.heat = 0
            bad_status.breeze = 0
            bad_status.electrification_id = 0
            bad_status.electrification = 0
            bad_status.dirty = 0
        break

        case 'heat':
            bad_status.heat = status_duration(status_type)  
            bad_status.burn_id = 0
            bad_status.burn = 0                      
            // bad_status.cold = 0
            // bad_status.wet = 0
        break

        case 'burn':
            bad_status.burn = status_duration(status_type)                    
            bad_status.burn_id = sender_id
            bad_status.cold = 0
            bad_status.wet = 0
            bad_status.heat = 0
            bad_status.breeze = 0
            bad_status.electrification_id = 0
            bad_status.electrification = 0
            bad_status.dirty = 0
        break

        case 'dirty':
            bad_status.dirty = status_duration(status_type)
            bad_status.petrification = 0
            // bad_status.breeze = 0
            // bad_status.electrification_id = 0
            // bad_status.electrification = 0
        break

        case 'petrification':
            bad_status.petrification = status_duration(status_type)
            bad_status.burn_id = 0
            bad_status.burn = 0
            bad_status.cold = 0
            bad_status.wet = 0
            bad_status.heat = 0
            bad_status.breeze = 0
            bad_status.dirty = 0
        break

        case 'breeze':
            bad_status.breeze = status_duration(status_type)
            bad_status.electrification_id = 0
            bad_status.electrification = 0
            // bad_status.cold = 0
            // bad_status.wet = 0
        break

        case 'electrification':
            bad_status.electrification = status_duration(status_type)  
            bad_status.electrification_id = sender_id             
            bad_status.burn_id = 0
            bad_status.burn = 0
            bad_status.heat = 0
            bad_status.breeze = 0
            bad_status.dirty = 0
            bad_status.wet = 0
        break
    }

    return bad_status
}

function magicBadStatusConversion(damage, enemy){
    if(enemy.bad_status.wet > 0 && ((damage.type == 'rod_wind' && status_chance(70)) || damage.type == 'rod_ice')){
        enemy.bad_status.cold = status_duration('cold')                
        sendBadStatus(enemy.id, player.id, 'rod_ice')
    }

    if(enemy.bad_status.heat > 0 && ((damage.type == 'rod_water' && status_chance(80)) || damage.type == 'rod_lava')){
        enemy.bad_status.cold = status_duration('burn')                
        sendBadStatus(enemy.id, player.id, 'rod_lava')
    }

    if(enemy.bad_status.dirty > 0 && ((damage.type == 'rod_fire' && status_chance(70)) || damage.type == 'rod_stone')){
        enemy.bad_status.cold = status_duration('petrification')                
        sendBadStatus(enemy.id, player.id, 'rod_stone')
    }

    if(enemy.bad_status.breeze > 0 && ((damage.type == 'rod_earth' && status_chance(80)) || damage.type == 'rod_eletric')){
        enemy.bad_status.cold = status_duration('electrification')                
        sendBadStatus(enemy.id, player.id, 'rod_eletric')
    }
}

function magicDamageControl(damage, enemy){
    if(damage.type == 'rod_fire' || damage.type == 'rod_lava' || damage.type == 'rod_water' || damage.type == 'rod_ice'
    || damage.type == 'rod_earth' || damage.type == 'rod_stone' || damage.type == 'rod_wind' || damage.type == 'rod_eletric'){

        if(damage.type != 'rod_wind' && damage.type != 'rod_eletric'){
            damage.finished = true                    
            sendDamageFinish(player.id, damage.id)
        }                

        switch(damage.bad_status){
            case 'burn':
                if(status_chance(60)){
                    enemy.bad_status.burn = status_duration(damage.bad_status)
                    sendBadStatus(enemy.id, player.id, damage.type)
                }
            break

            case 'heat':
                if(status_chance(100)){
                    enemy.bad_status.heat = status_duration(damage.bad_status)                                                       
                    sendBadStatus(enemy.id, player.id, damage.type)
                }
            break

            case 'wet':
                if(status_chance(100)){
                    enemy.bad_status.wet = status_duration(damage.bad_status)
                    sendBadStatus(enemy.id, player.id, damage.type)
                }
            break

            case 'cold':
                if(status_chance(50)){
                    enemy.bad_status.cold = status_duration(damage.bad_status)
                    sendBadStatus(enemy.id, player.id, damage.type)
                }
            break

            case 'dirty':
                if(status_chance(100)){
                    enemy.bad_status.dirty = status_duration(damage.bad_status)
                    sendBadStatus(enemy.id, player.id, damage.type)
                }
            break

            case 'petrification':
                if(status_chance(50)){
                    enemy.bad_status.petrification = status_duration(damage.bad_status)
                    sendBadStatus(enemy.id, player.id, damage.type)
                }
            break

            case 'breeze':
                if(status_chance(100)){
                    enemy.bad_status.breeze = status_duration(damage.bad_status)
                    sendBadStatus(enemy.id, player.id, damage.type)
                }
            break

            case 'electrification':
                if(status_chance(60)){
                    enemy.bad_status.electrification = status_duration(damage.bad_status)
                    sendBadStatus(enemy.id, player.id, damage.type)
                }
            break
        }
    }
}

function resultDamageControl(damage, enemy){
    var result = 0
    if(damage.magic){
        result = m_attack_vs_m_defense(
            player.attributes_values.m_attack * damage.attack_percentage / 100, 
            player.attributes.dexterity + damage.bonus_dexterity, 
            enemy.attributes_values.m_defense
        )
    }else{
        result = attack_vs_defense(
            player.attributes_values.attack * (1+damage.attack_percentage) / 100, 
            player.attributes.dexterity + damage.bonus_dexterity, 
            enemy.attributes_values.defense
        )
    }
    return result
}