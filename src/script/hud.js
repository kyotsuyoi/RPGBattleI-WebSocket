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

        this.sprite_spell = createImage('src/image/hud_spell_empty.png')

        this.sprite_icon_1 = this.setSpellIcon(player.skill.spell_type_1)
        this.sprite_icon_2 = this.setSpellIcon(player.skill.spell_type_2)
        this.sprite_icon_3 = this.setSpellIcon(player.skill.spell_type_3)
        this.sprite_icon_4 = this.setSpellIcon(player.skill.spell_type_4)       

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

        var currentCoolDown = spellCooldown(damage.coolDown, inteligence, dexterity) 
        var calc = Math.round(22 * player.cooldown.spell_type_1 / currentCoolDown) 

        context.fillStyle = '#555555dd'        
        context.fillRect(this.position.x + 23, this.position.y - 30, calc, 21) 

        //sprite_icon_2
        var damage = new Damage({
            x : undefined, y : undefined, 
            owner_id : undefined, owner : undefined, type : player.skill.spell_type_2, side : undefined, 
            character_width : undefined, character_height: undefined, lastTimestamp : undefined
        })  

        var currentCoolDown = spellCooldown(damage.coolDown, inteligence, dexterity) 
        var calc = Math.round(22 * player.cooldown.spell_type_2 / currentCoolDown) 

        context.fillStyle = '#555555dd'        
        context.fillRect(this.position.x + 23 + 31, this.position.y - 30, calc, 21) 

        //sprite_icon_3
        var damage = new Damage({
            x : undefined, y : undefined, 
            owner_id : undefined, owner : undefined, type : player.skill.spell_type_3, side : undefined, 
            character_width : undefined, character_height: undefined, lastTimestamp : undefined
        })  

        var currentCoolDown = spellCooldown(damage.coolDown, inteligence, dexterity) 
        var calc = Math.round(22 * player.cooldown.spell_type_3 / currentCoolDown) 

        context.fillStyle = '#555555dd'        
        context.fillRect(this.position.x + 23 + 30 + 32, this.position.y - 30, calc, 21) 

        //sprite_icon_4
        var damage = new Damage({
            x : undefined, y : undefined, 
            owner_id : undefined, owner : undefined, type : player.skill.spell_type_4, side : undefined, 
            character_width : undefined, character_height: undefined, lastTimestamp : undefined
        })  

        var currentCoolDown = spellCooldown(damage.coolDown, inteligence, dexterity) 
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

        if(player.good_status.sword_reinforce > 0){
            var calc = Math.round(22 * player.good_status.sword_reinforce / status_duration('sword_reinforce')) 

            context.fillStyle = 'yellow'        
            context.fillRect(this.position.x + 23 + 31 + 31 + 31, this.position.y - 30, calc, 5) 
        }   

        // if(player.good_status.damage_transfer > 0){
        //     var calc = Math.round(22 * player.good_status.damage_transfer / status_duration('damage_transfer')) 

        //     context.fillStyle = 'yellow'        
        //     context.fillRect(this.position.x + 23 + 31 + 31 + 31, this.position.y - 30, calc, 5) 
        // } 
        //-------
    }

    setSpellIcon(skill_type){
        var sprite_icon
        switch(skill_type){ 

            case 'power_blade':
                sprite_icon = createImage('src/image/icon_power_sword.png')
            break

            case 'rapid_blade':
                sprite_icon = createImage('src/image/icon_rapid_blade.png')
            break

            case 'phanton_blade':
                sprite_icon = createImage('src/image/icon_phanton_blade.png')
            break
            
            case 'sword_reinforce':
                sprite_icon = createImage('src/image/icon_sword_reinforce.png')
            break

            case 'ghost_blade':
                sprite_icon = createImage('src/image/icon_ghost_blade.png')
            break

            case 'shield_reinforce':
                sprite_icon = createImage('src/image/icon_shield_reinforce.png')
            break

            case 'shield_reflect':
                sprite_icon = createImage('src/image/icon_shield_reflect.png')
            break

            case 'damage_transfer':
                sprite_icon = createImage('src/image/icon_damage_transfer.png')
            break

            case 'rod_water':
                sprite_icon = createImage('src/image/icon_rod_water.png')
            break

            case 'rod_ice':
                sprite_icon = createImage('src/image/icon_rod_ice.png')
            break

            case 'rod_fire':
                sprite_icon = createImage('src/image/icon_rod_fire.png')
            break

            case 'rod_lava':
                sprite_icon = createImage('src/image/icon_rod_vulcano.png')
            break

            case 'rod_wind':
                sprite_icon = createImage('src/image/icon_rod_wind.png')
            break

            case 'rod_eletric':
                sprite_icon = createImage('src/image/icon_rod_eletric.png')
            break

            case 'rod_earth':
                sprite_icon = createImage('src/image/icon_rod_earth.png')
            break

            case 'rod_stone':
                sprite_icon = createImage('src/image/icon_rod_stone.png')
            break

            case 'arrow_fire':
                sprite_icon = createImage('src/image/icon_arrow_fire.png')
            break

            case 'arrow_pierce':
                sprite_icon = createImage('src/image/icon_arrow_pierce.png')
            break

            case 'arrow_triple':
                sprite_icon = createImage('src/image/icon_arrow_triple.png')
            break

            default:                
                sprite_icon = createImage('src/image/icon_blocked.png')
        }

        return sprite_icon
    }
}