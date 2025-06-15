function attack_value(power, dexterity){
    return power + (power/2) + (dexterity/5)
}

function m_attack_value(inteligence, dexterity){
    return inteligence + (inteligence/2) + (dexterity/5)
}

function defense_value(vitality, power){
    return  vitality + (power * 0.2)
}

function m_defense_value(inteligence, dexterity){
    return  inteligence + (dexterity/3)
}

function flee_value(agility, dexterity){
    return  (agility/2) + (dexterity/5)
}

function accuracy_value(agility, dexterity){
    return  (agility/6) + (dexterity/2)
}

function hp_value(vitality, power){
    var A = (((vitality-1)/100) * 3000)
    var B = (((power-1)/100) * 500)

    if(B<0) B=0
    return 20+Math.round(A + B)
}

function sp_value(inteligence, dexterity){
    var A = (((inteligence-1)/100) * 1100)
    var B = (((dexterity-1)/100) * 400)

    return 10+Math.round(A + B)
}

//reverse
function attack_speed_value(agility){
    var ext_val = (20*agility/100)
    var val = 8 - ext_val
    if(val < 2){
        val = 2
    }
    return val
}

function speed_value(agility){
    var val = 0.8 + agility * 0.01
    if(val > 2){
        val = 2
    }
    return val
}

function attack_vs_defense(attack, dexterity, defense){
    var round = Math.round(Math.random() * (attack/(2-(dexterity/100)) - 1 + (dexterity/100)) + 1 + (dexterity/100));

    var result = attack + round - defense/3;  
    if(defense > attack){
        round = Math.round(Math.random() * (attack/(4-(dexterity/100)) - 1 + (dexterity/100)) + 1 + (dexterity/100));
        result = round; 
    }

    if(result <= 0){
        return 1
    }
    return Math.round(result)
}

function m_attack_vs_m_defense(m_attack, dexterity, m_defense){
    var round = Math.round(Math.random() * (m_attack/(2-(dexterity/100)) - 1 + (dexterity/100)) + 1 + (dexterity/100));

    var result = m_attack + round - m_defense/3;  
    if(m_defense > m_attack){
        round = Math.round(Math.random() * (m_attack/(4-(dexterity/100)) - 1 + (dexterity/100)) + 1 + (dexterity/100));
        result = round; 
    }

    if(result <= 0){
        return 1
    }
    return Math.round(result)
}

function dexterity_vs_flee(dexterity, agility){
    //var random_percent = Math.round(Math.random() * ((100) - 0) + 0)
    // var hit = (dexterity*100/agility)        

    //console.log('dex:'+dexterity +' | agi:'+agility)  

    agility *=0.7
    var diff = dexterity - agility
    var mean = (dexterity + agility) / 2
    var ratio = diff / mean
    var angle = Math.atan(ratio)
    var percentage = (2 / Math.PI) * angle * (1 + Math.abs(diff) / mean) * 100
  
    var random_num = Math.round(Math.random() * 201) - 100
    //console.log('percentage:'+percentage +' | random_num:'+random_num)
    
    //is hit?
    if(percentage > random_num){
        return true;
    }
    return false;
}

//power_a is attack and power_b is defense
function knock_back(damage_power, power_a, power_b){
    var result = (power_a * 0.4 - power_b * 0.3) + damage_power
    if(result <= 0){
        return 0
    }
    if (result > 50){
        result = 50
    }
    return result
}

function hp_recovery(vitality){
    return 0.06 + (vitality/100)
}

function sp_recovery(inteligence, dexterity){
    return 0.02 + (inteligence/250) + (dexterity/300)
}

//power_a is defense and power_or_inteligence_b is attack
function stamina_vs_attack(power_a, power_or_inteligence_b){
    var res = (power_or_inteligence_b / power_a) * 100
    return res * 0.2
}

function cure_spell(target_max_hp, inteligence){
    return (target_max_hp*20/100) * (inteligence/100)
}

function spellCooldown(cooldown_value, inteligence, dexterity){
    var val = Math.round(cooldown_value * ((inteligence*0.4 + dexterity*0.3)/100))
    val = cooldown_value - val
    if(val < 3){
        val = 3
    }
    return val
}

function status_duration(type){
    switch (type){
        //good
        case 'shield_reinforce': return 120
        case 'shield_reflect': return 80        
        case 'damage_transfer': return 120
        
        case 'sword_reinforce': return 60
        
        case 'shield_magic': return 30
        
        //bad
        case 'heat' : return 120
        case 'burn' : return 80

        case 'wet' : return 120
        case 'cold' : return 40
        
        case 'dirty' : return 120
        case 'petrification' : return 40
        
        case 'breeze' : return 120
        case 'electrification' : return 80
    }
}

function status_chance(percentage){
    var val = Math.floor(Math.random() * 101)
    if (val < percentage){
        return true
    }
    return false
}

function reflect_arrow(direction) {
    const vertical = ['up', 'down'];
    const horizontal = ['left', 'right'];

    if (vertical.includes(direction)) {
        return horizontal[Math.floor(Math.random() * 2)];
    } else if (horizontal.includes(direction)) {
        return vertical[Math.floor(Math.random() * 2)];
    } else {
        throw new Error("Direção inválida. Use 'up', 'down', 'left' ou 'right'.");
    }
}

function elementalCalc(bad_status, type){
    var mult = 1

    if((bad_status.wet > 0 || bad_status.cold > 0) && (type == 'rod_eletric' || type == 'rod_wind')){
        mult = 1.8
    }

    if((bad_status.burn > 0 || bad_status.heat > 0) && (type == 'rod_water' || type == 'rod_ice')){
        mult = 1.8
    }

    if((bad_status.dirty > 0 || bad_status.petrification > 0) && (type == 'rod_fire' || type == 'rod_lava')){
        mult = 1.8
    }

    if((bad_status.breeze > 0 || bad_status.electrification > 0) && (type == 'rod_earth' || type == 'rod_stone')){
        mult = 1.8
    }
    
    
    if((bad_status.wet > 0 || bad_status.cold > 0) && (type == 'rod_fire' || type == 'rod_lava')){
        mult = 0.5
    }
    
    if((bad_status.heat > 0 || bad_status.burn > 0) && (type == 'rod_earth' || type == 'rod_stone')){
        mult = 0.5
    }

    if((bad_status.dirty > 0 || bad_status.petrification > 0) && (type == 'rod_eletric' || type == 'rod_wind')){
        mult = 0.5
    }

    if((bad_status.breeze > 0 || bad_status.electrification > 0) && (type == 'rod_water' || type == 'rod_ice')){
        mult = 0.5
    }

    return mult
}