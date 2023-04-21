function attack_value(power, dexterity){
    return power + (power/2) + (dexterity/5)
}

function m_attack_value(inteligence, dexterity){
    return inteligence + (inteligence/2) + (dexterity/5)
}

function defense_value(vitality, dexterity){
    return  vitality + (dexterity/3)
}

function m_defense_value(inteligence, dexterity){
    return  inteligence + (dexterity/3)
}

function flee_value(agility, dexterity){
    return  (agility/2) + (dexterity/5)
}

function hp_value(vitality, power){
    return  100 + (vitality*10) + (power*5)
}

function sp_value(inteligence, dexterity){
    return  40 + (inteligence*6) + (dexterity*3)
}

//reverse
function attack_speed_value(agility){
    var ext_val = (20*agility/100)
    var val = 20 - ext_val
    if(val < 2){
        val = 2
    }
    return val
}

function speed_value(agility){
    var val = 0.5 + agility / 10
    if(val < 0.8){
        val = 0.8
    }
    if(val > 2){
        val = 2
    }
    return val
}

function attack_vs_defense(attack, dexterity, defense){
    var round = Math.round(Math.random() * (attack/(2-(dexterity/100)) - 1 + (dexterity/100)) + 1 + (dexterity/100));

    var result = attack + round - defense;  
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

    var result = m_attack + round - m_defense;  
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
    var result = (power_a - power_b) + damage_power
    if(result <= 0){
        return 0
    }
    if (result > 50){
        result = 50
    }
    return result
}

function hp_recovery(vitality){
    return 0.06 + (vitality/1000)
}

function sp_recovery(inteligence, dexterity){
    return 0.02 + (inteligence/500) + (dexterity/1000)
}

function stamina_vs_attack(attack_result){
    return res = (attack_result/2)
}

function cure_spell(target_max_hp, inteligence){
    return (target_max_hp*20/100) * (inteligence/100)
}

function spell_cooldown(cooldown_value, inteligence, dexterity){
    var val = Math.round(cooldown_value - (inteligence*40/100) - (dexterity*30/100))
    if(val < 1){
        val = 1
    }
    return val
}

function status_duration(type){
    switch (type){
        //good
        case 'shield_reinforce': return 120
        case 'shield_reflect': return 80
        
        //bad
        case 'burn' : return 40
        case 'cold' : return 40
    }
}

function status_value(type){
    switch (type){
        //good
        
        //bad
        case 'burn' : return 10
        case 'cold' : return 10
    }
}