class Hud {
    constructor({id}){
        this.id = id
        this.position = {
            x : 0,
            y : 0
        }
        this.width = 150
        this.height = 48

        this.position.x = 0
        this.position.y = 0

        if(id == 'player'){
            this.position.x = 0 + 2
            this.position.y = 800 - this.height - 2
            this.sprite_spell = createImage('src/image/hud_spell.png')

            switch (char_gender){
                case 'male':
                    this.face = createImage('src/image/knight_male_face.png')
                break

                case 'female':
                    this.face = createImage('src/image/knight_female_face.png')
                break

                default:
                    this.face = undefined
            }            
        }
        
        this.sprite = createImage('src/image/hud_large.png')

        this.currentSprite = this.sprite
        this.currentCropWidth = 0

        this.currentSpriteSpell = this.sprite_spell
        this.currentSpellCropWidth = 0
    }

    draw(){
        // context.fillStyle = 'blue'
        // context.fillRect(this.position.x, this.position.y, this.width, this.height)

        if (player == null){
            return
        }

        context.drawImage(          
            this.currentSprite, 
            0,
            0,
            150, //largura
            48, //altura
            this.position.x, 
            this.position.y,
            this.width,
            this.height
        )   
        
        context.drawImage(          
            this.face, 
            0,
            0,
            150, //largura
            48, //altura
            this.position.x +14, 
            this.position.y +15,
            this.width,
            this.height
        )  

        context.drawImage(          
            this.sprite_spell, 
            0,
            0,
            150, //largura
            48, //altura
            this.position.x +14 + 20, 
            this.position.y - 25,
            this.width,
            this.height
        )         

        var hp = player.attributes_values.hp
        var max_hp = player.attributes_values.max_hp
        var sp = player.attributes_values.sp
        var max_sp = player.attributes_values.max_sp
        var stamina = player.attributes_values.stamina
        var max_stamina = player.attributes_values.max_stamina            
        var powerBladeCoolDown = player.powerBladeCoolDown
        var rapidBladeCoolDown = player.rapidBladeCoolDown
        var phantonBladeCoolDown = player.phantonBladeCoolDown
        var cureCoolDown = player.cureCoolDown            
        var inteligence = player.attributes.inteligence          
        var dexterity = player.attributes.dexterity        

        //HP bar
        var hp_percent = Math.round(hp * 100) / max_hp
        var bar_value = (76 * hp_percent) / 100
        if(hp_percent<=25){
            context.fillStyle = 'red'
        }else{
            context.fillStyle = 'green'
        }
        context.fillRect(this.position.x + 55, this.position.y + 6, bar_value, 6)   
        
        //HP text
        context.font = "8px Arial Black";
        context.fillStyle = 'black';
        context.fillText(Math.round(hp) + '/' + Math.round(max_hp),this.position.x + 70, this.position.y + 12)

        //SP bar
        var sp_percent = Math.round(sp * 100) / max_sp
        var bar_value = (76 * sp_percent) / 100
        context.fillStyle = '#2865c7'        
        context.fillRect(this.position.x + 55, this.position.y + 21, bar_value, 6)  
        
        //SP text
        context.font = "8px Arial Black";
        context.fillStyle = 'black';
        context.fillText(Math.round(sp) + '/' + Math.round(max_sp),this.position.x + 70, this.position.y + 27)
        
        var stamina_percent = Math.round(stamina * 100) / max_stamina
        var bar_value = (76 * stamina_percent) / 100
        if(stamina_percent<=25){
            context.fillStyle = 'orange'
        }else{
            context.fillStyle = 'yellow'
        }       
        context.fillRect(this.position.x + 55, this.position.y + 21 + 15, bar_value, 6)

        //Stamina text
        context.font = "8px Arial Black";
        context.fillStyle = 'black';
        context.fillText(Math.round(stamina) + '/' + Math.round(max_stamina),this.position.x + 70, this.position.y + 42)


        //Power Blade bar 
        damage = new Damage({
            x : player.position.x, y : player.position.y, 
            owner_id : 'p1', owner : 'player', type : 'power_blade', side : player.side, 
            character_width : player.width, character_height: player.height, lastTimestamp : lastTimestamp
        })       
           
        var currentCoolDown = spell_cooldown(damage.coolDown, inteligence, dexterity) 
        var calc = Math.round(16 * powerBladeCoolDown / currentCoolDown) 

        context.fillStyle = '#555555dd'        
        context.fillRect(this.position.x + 47, this.position.y - 20, calc, 16) 


        //Rapid Blade bar
        var damage = null    
        if (this.id=='p1'){
            damage = new Damage({
                x : player.position.x, y : player.position.y, 
                owner_id : 'p1', owner : 'player', type : 'rapid_blade', side : player.side, 
                character_width : player.width, character_height: player.height, lastTimestamp : lastTimestamp
            }) 
        }else{
            damage = new Damage({
                x : player.position.x, y : player.position.y, 
                owner_id : 'p2', owner : 'player', type : 'ghost_blade', side : player.side, 
                character_width : player.width, character_height: player.height, lastTimestamp : lastTimestamp
            }) 
        }  
        var currentCoolDown = spell_cooldown(damage.coolDown, inteligence, dexterity) 
        var calc = Math.round(16 * rapidBladeCoolDown / currentCoolDown)         

        //context.fillText(currentCoolDown + '/' + damage.coolDown,this.position.x, this.position.y + 27)
        
        context.fillStyle = '#555555dd'        
        context.fillRect(this.position.x + 72, this.position.y - 20, calc, 16) 


        //Phanton Blade bar
        var damage = new Damage({
            x : player.position.x, y : player.position.y, 
            owner_id : 'p1', owner : 'player', type : 'phanton_blade', side : player.side, 
            character_width : player.width, character_height: player.height, lastTimestamp : lastTimestamp
        })    
        var currentCoolDown = spell_cooldown(damage.coolDown, inteligence, dexterity) 
        var calc = Math.round(16 * phantonBladeCoolDown / currentCoolDown) 

        context.fillStyle = '#555555dd'        
        context.fillRect(this.position.x + 97, this.position.y - 20, calc, 16) 


        //Cure bar
        var damage = new Damage({
            x : player.position.x, y : player.position.y, 
            owner_id : 'p1', owner : 'player', type : 'cure', side : player.side, 
            character_width : player.width, character_height: player.height, lastTimestamp : lastTimestamp
        })    
        var currentCoolDown = spell_cooldown(damage.coolDown, inteligence, dexterity) 
        var calc = Math.round(16 * cureCoolDown / currentCoolDown) 

        context.fillStyle = '#555555dd'        
        context.fillRect(this.position.x + 97, this.position.y - 20, calc, 16) 
        
    }
}