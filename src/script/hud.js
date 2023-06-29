class Hud {
    constructor({id}){
        this.id = id
        this.character_class = character_class
        this.position = {
            x : 0,
            y : 0
        }
        this.width = 150
        this.height = 48

        this.position.x = 0
        this.position.y = 0

        this.sprite_spell = createImage('src/image/hud_spell_empty.png')

        switch(player.character_class){
            case 'knight':
                this.sprite_icon_1 = createImage('src/image/icon_power_sword.png')
                this.sprite_icon_2 = createImage('src/image/icon_ghost_blade.png')
                this.sprite_icon_3 = createImage('src/image/icon_phanton_blade.png')
                //this.sprite_icon_4 = createImage('src/image/icon_spear.png')
                this.sprite_icon_4 = createImage('src/image/icon_blocked.png')
            break

            case 'wizzard':
                this.sprite_icon_1 = createImage('src/image/icon_rod_vulcano.png')
                this.sprite_icon_2 = createImage('src/image/icon_rod_ice.png')
                this.sprite_icon_3 = createImage('src/image/icon_rod_eletric.png')
                this.sprite_icon_4 = createImage('src/image/icon_rod_stone.png')
            break

            case 'mage':
                this.sprite_icon_1 = createImage('src/image/icon_rod_fire.png')
                this.sprite_icon_2 = createImage('src/image/icon_rod_water.png')
                this.sprite_icon_3 = createImage('src/image/icon_rod_wind.png')
                this.sprite_icon_4 = createImage('src/image/icon_rod_earth.png')
            break

            case 'archer':
                /*
                this.sprite_icon_1 = createImage('src/image/icon_arrow_fire.png')
                this.sprite_icon_2 = createImage('src/image/icon_arrow_piercing.png')
                this.sprite_icon_3 = createImage('src/image/icon_arrow_tri.png')
                */
                this.sprite_icon_1 = createImage('src/image/icon_blocked.png')
                this.sprite_icon_2 = createImage('src/image/icon_blocked.png')
                this.sprite_icon_3 = createImage('src/image/icon_blocked.png')
                this.sprite_icon_4 = createImage('src/image/icon_blocked.png')
            break

            case 'squire':
                this.sprite_icon_1 = createImage('src/image/icon_rapid_blade.png')
                this.sprite_icon_2 = createImage('src/image/icon_shield_reinforce.png')
                this.sprite_icon_3 = createImage('src/image/icon_shield_reflect.png')
                //this.sprite_icon_3 = createImage('src/image/icon_blocked.png')
                //this.sprite_icon_4 = createImage('src/image/icon_spear.png')
                this.sprite_icon_4 = createImage('src/image/icon_blocked.png')
            break
        }
        

        if(id == 'player'){
            this.position.x = 0 + 2
            this.position.y = 800 - this.height - 2

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
            this.position.x + 10, 
            this.position.y - 35,
            this.width,
            this.height
        )  
        
        context.drawImage(
            this.sprite_icon_1,
            0,
            0,
            20, //largura
            20, //altura
            this.position.x + 24, 
            this.position.y - 30,
            20,
            20
        )

        context.drawImage(
            this.sprite_icon_2,
            0,
            0,
            20, //largura
            20, //altura
            this.position.x + 55, 
            this.position.y - 30,
            20,
            20
        )

        context.drawImage(
            this.sprite_icon_3,
            0,
            0,
            20, //largura
            20, //altura
            this.position.x + 86, 
            this.position.y - 30,
            20,
            20
        )

        context.drawImage(
            this.sprite_icon_4,
            0,
            0,
            20, //largura
            20, //altura
            this.position.x + 24 + 31 + 31 + 31, 
            this.position.y - 30,
            20,
            20
        )

        var hp = player.attributes_values.hp
        var max_hp = player.attributes_values.max_hp
        var sp = player.attributes_values.sp
        var max_sp = player.attributes_values.max_sp
        var stamina = player.attributes_values.stamina
        var max_stamina = player.attributes_values.max_stamina           
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
        context.fillRect(this.position.x + 55, this.position.y + 5, bar_value, 8)   
        
        //HP text
        context.font = "8px Arial Black";
        context.fillStyle = 'black';
        context.fillText(Math.round(hp) + '/' + Math.round(max_hp),this.position.x + 70, this.position.y + 12)

        //SP bar
        var sp_percent = Math.round(sp * 100) / max_sp
        var bar_value = (76 * sp_percent) / 100
        context.fillStyle = '#2865c7'        
        context.fillRect(this.position.x + 55, this.position.y + 20, bar_value, 8)  
        
        //SP text
        context.font = "8px Arial Black";
        context.fillStyle = 'black';
        context.fillText(Math.round(sp) + '/' + Math.round(max_sp),this.position.x + 70, this.position.y + 27)
        
        //Stamina bar
        var stamina_percent = Math.round(stamina * 100) / max_stamina
        var bar_value = (76 * stamina_percent) / 100
        if(stamina_percent<=25){
            context.fillStyle = 'orange'
        }else{
            context.fillStyle = 'yellow'
        }       
        context.fillRect(this.position.x + 55, this.position.y + 21 + 14, bar_value, 8)

        //Stamina text
        context.font = "8px Arial Black";
        context.fillStyle = 'black';
        context.fillText(Math.round(stamina) + '/' + Math.round(max_stamina),this.position.x + 70, this.position.y + 42)

        //sprite_icon_1
        var damage = new Damage({
            x : undefined, y : undefined, 
            owner_id : undefined, owner : undefined, type : player.skill.spell_type_1, side : undefined, 
            character_width : undefined, character_height: undefined, lastTimestamp : undefined
        })  

        var currentCoolDown = spell_cooldown(damage.coolDown, inteligence, dexterity) 
        var calc = Math.round(22 * player.cooldown.spell_type_1 / currentCoolDown) 

        context.fillStyle = '#555555dd'        
        context.fillRect(this.position.x + 23, this.position.y - 30, calc, 21) 

        //sprite_icon_2
        var damage = new Damage({
            x : undefined, y : undefined, 
            owner_id : undefined, owner : undefined, type : player.skill.spell_type_2, side : undefined, 
            character_width : undefined, character_height: undefined, lastTimestamp : undefined
        })  

        var currentCoolDown = spell_cooldown(damage.coolDown, inteligence, dexterity) 
        var calc = Math.round(22 * player.cooldown.spell_type_2 / currentCoolDown) 

        context.fillStyle = '#555555dd'        
        context.fillRect(this.position.x + 23 + 31, this.position.y - 30, calc, 21) 

        //sprite_icon_3
        var damage = new Damage({
            x : undefined, y : undefined, 
            owner_id : undefined, owner : undefined, type : player.skill.spell_type_3, side : undefined, 
            character_width : undefined, character_height: undefined, lastTimestamp : undefined
        })  

        var currentCoolDown = spell_cooldown(damage.coolDown, inteligence, dexterity) 
        var calc = Math.round(22 * player.cooldown.spell_type_3 / currentCoolDown) 

        context.fillStyle = '#555555dd'        
        context.fillRect(this.position.x + 23 + 30 + 32, this.position.y - 30, calc, 21) 

        //sprite_icon_4
        var damage = new Damage({
            x : undefined, y : undefined, 
            owner_id : undefined, owner : undefined, type : player.skill.spell_type_4, side : undefined, 
            character_width : undefined, character_height: undefined, lastTimestamp : undefined
        })  

        var currentCoolDown = spell_cooldown(damage.coolDown, inteligence, dexterity) 
        var calc = Math.round(22 * player.cooldown.spell_type_4 / currentCoolDown) 

        context.fillStyle = '#555555dd'        
        context.fillRect(this.position.x + 23 + 30 + 63, this.position.y - 30, calc, 21) 

        //need adjust-----
        if(player.good_status.shield_reinforce > 0){
            var calc = Math.round(22 * player.good_status.shield_reinforce / status_duration('shield_reinforce')) 

            context.fillStyle = 'yellow'        
            context.fillRect(this.position.x + 23 + 31, this.position.y - 30, calc, 5) 
        }     
        if(player.good_status.shield_reflect > 0){
            var calc = Math.round(22 * player.good_status.shield_reflect / status_duration('shield_reflect')) 

            context.fillStyle = 'yellow'        
            context.fillRect(this.position.x + 23 + 31 + 31, this.position.y - 30, calc, 5) 
        }  
        //-------
    }
}