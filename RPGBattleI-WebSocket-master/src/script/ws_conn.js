
const chat_input = document.querySelector('#chat-input')
//const output = document.querySelector('output')
const chat_output = document.getElementById('chat-output')

const chat = document.getElementById('chat')
const button_send = document.getElementById('button_send')

const login = document.getElementById('login')
const button_user_name = document.getElementById('button_user_name')
const checkbox_char_gender = document.getElementById('checkbox_char_gender')
const checkbox_char_class = document.getElementById('checkbox_char_class')
var char_gender, character_class
var input_ip = document.getElementById('input_ip')
const attributes = document.getElementById('attributes')

var button_user_name_click_count = 0
input_ip.value = "192.168.15.50"

var player_id

chat.style.display = 'none'

// conn.addEventListener('open', console.log)
// conn.addEventListener('message', console.log)

var conn = null

chat_input.addEventListener('keypress', e =>{
    if (e.code === 'Enter'){
        send_message()
    }            
})

button_send.addEventListener("click", send_message)

function send_message() {
    const text = chat_input.value
    if (text === ''){
        return
    }

    //const input_msg = document.getElementById('input');
    // const message = chat_input.value.trim();
    // if (message) {
    //     const msgDiv = document.createElement('div');
    //     msgDiv.textContent = message;
    //     chat_output.appendChild(msgDiv);
    // }

    if(text.substring(0,6)=='code:>'){
        var code = text.substring(6,10)
        switch (code){
            case 'pow:':
                var value = Number(text.replace('code:>pow:',''))
                player.attributes.power = parseInt(value)
            break
            case 'agi:':
                var value = Number(text.replace('code:>agi:',''))
                player.attributes.agility = parseInt(value)
            break
            case 'dex:':
                var value = Number(text.replace('code:>dex:',''))
                player.attributes.dexterity = parseInt(value)
            break
            case 'vit:':
                var value = Number(text.replace('code:>vit:',''))
                player.attributes.vitality = parseInt(value)
            break
            case 'int:':
                var value = Number(text.replace('code:>int:',''))
                player.attributes.inteligence = parseInt(value)
            break
            case 'deb:':
                var value = text.replace('code:>deb:','')
                if(value=='player') player.is_debug = !player.is_debug
            break
            default :
                player.setMessage('BAD CODE')
                return
        }
        player.setAttributesValues()
        player.setMessage('CODE RUNNER')
        return
    }
    chat_output.append('Eu (' + player_id + '): ' + text, document.createElement('br'))
    var json = JSON.parse('{ "type":"chat" , "text":"' + text + '" }')
    //conn.send(          '{ "type":"chat" , "text":"' + text + '" }')
    connSend(json)
    chat_input.value = ''

    player.setMessage(text)

    //document.getElementById('chat-output').scrollTop = document.getElementById('chat-output').scrollHeight;
    chat_output.scrollTop = chat_output.scrollHeight;
}

button_user_name.addEventListener("click", send_user_name)

function send_user_name() {
    if(button_user_name_click_count>0){
        return
    }

    const value = user_name.value
    if (value === ''){
        return
    }  

    document.getElementById('background').style.display = 'block';

    char_gender = checkbox_char_gender.options[checkbox_char_gender.selectedIndex].value
    character_class = checkbox_char_class.options[checkbox_char_class.selectedIndex].value
    button_user_name_click_count++  
    setConnection(value)  
}

function setConnection(user_name){
    //conn = new WebSocket('wss://websocket-test-rpg-game.glitch.me/')
    conn = new WebSocket('ws://' + input_ip.value + ':8085')
    conn.addEventListener('message', message => {
        const data = JSON.parse(message.data)

        recep_tax ++

        if(data.type === 'chat'){
            chat_output.append(data.user_name +' (' + data.id + '): ' + data.text, document.createElement('br'))
            var p = players.find(element => element.id == data.id)
            p.setMessage(data.text)
            //document.getElementById('chat-output').scrollTop = document.getElementById('chat-output').scrollHeight;
            chat_output.scrollTop = chat_output.scrollHeight;
        }
    
        if(data.type === 'action'){
            var id = data.id
            var p = players.find(element => element.id == id)
            if(p != undefined){
                p.position.x = data.x
                p.position.y = data.y
                p.state = data.state
                p.attributes_values = data.attributes_values
                p.good_status = data.good_status
                p.bad_status = data.bad_status
            }
            //console.log(p.state)
        }
    
        if(data.type === 'action_attack'){
            var id = data.id
            var attack_type = data.attack_type
            var p = players.find(element => element.id == id)
            p.attributes_values = data.attributes_values
            
            weapon = new Weapon({x : p.position.x, y : p.position.y, owner_id : id, 
                type : p.skill.primary_weapon_type, side : p.state.side})
            weapons.push(weapon)  

            damage = new Damage({ id : data.damage_id,
                x : p.position.x, y : p.position.y, 
                owner_id : p.id, owner : 'player', type : attack_type, side : p.state.side, 
                character_width : p.width, character_height: p.height, lastTimestamp : lastTimestamp
            })               
            damages.push(damage)                 
        }

        if(data.type === 'action_damage'){
            //console.log('action:'+data.type + ' from id:'+data.id)
            var p
            if(data.id === player_id){
                p = player
            }else{
                p = players.find(element => element.id == data.id)
            }

            if(p === undefined){
                console.log('action_damage: player is not defined')
                return
            }

            var color = 'red'
            if(data.result === 'MISS'){
                color = 'yellow'
            }

            if(data.stamina_result > 0){
                p.attributes_values.stamina -= data.stamina_result
                p.cooldown.stamina = 50
            }

            if(data.result > 0){
                p.attributes_values.hp -= data.result
                if(p.attributes_values.hp < 0){
                    p.attributes_values.hp = 0 
                }
                if(data.stun > 0){
                    p.bad_status.stun = data.stun
                    p.state.walking = false
                    keys.up.pressed = false 
                    keys.down.pressed = false 
                    keys.left.pressed = false 
                    keys.right.pressed = false
                }
                
                keys.defense.pressed = false
                p.state.defending = false

                setRumble('damage')
            }

            if(data.result > 0 || data.result == 'MISS'){
                display = new Display({x : p.position.x + p.width/2, y : p.position.y + p.height/2, 
                    color : color, text : data.result, type : 'damage'})
                displays.push(display) 
            }
            
            if(data.knockback_side === undefined || data.knockback_side === null) return
            switch (data.knockback_side){
                case 'up':   
                    
                    if(p.position.y - data.knockback_val <= 0){
                        p.position.y = 0
                    }else{                     
                        p.position.y -= data.knockback_val
                    }
                break

                case 'down':
                    if(p.position.y + p.height + data.knockback_val >= background.height){
                        p.position.y = background.height - p.height
                    }else{
                        p.position.y += data.knockback_val
                    }
                break

                case 'left':
                    if(p.position.x - data.knockback_val <= 0){
                        p.position.x = 0
                    }else{
                        p.position.x -= data.knockback_val
                    }
                break

                case 'right':
                    if(p.position.x + p.width + data.knockback_val >= background.width){
                        p.position.x = background.width - p.width
                    }else{
                        p.position.x += data.knockback_val
                    }
                break 
            }
        }

        if(data.type === 'action_damage_finish'){
            var damage = damages.find(element => element.id == data.damage_id && element.owner_id == data.id)
            if (damage != undefined) damage.finished = true
        }

        if(data.type === 'action_damage_update'){
            var damage = damages.find(element => element.id == data.damage_id && element.owner_id == data.id)
            damage.side = data.side
            damage.velocity_side()
            console.log('action:'+data.type + ' from id:'+data.id + ' damage_id:'+data.damage_id + ' side:'+data.side)
        }

        if(data.type === 'action_restore'){
            var p
            if(data.id === player_id){
                p = player
            }else{
                p = players.find(element => element.id == data.id)
            } 

            if(p === undefined){
                console.log('action_damage: player is not defined')
                return
            }
            
            var color = 'green'
            if(data.restore_type === 'area_cure'){
                color = 'green'
            }

            if(data.result > 0){
                p.attributes_values.hp += data.result
                if(p.attributes_values.hp > p.attributes_values.max_hp){
                    p.attributes_values.hp = p.attributes_values.max_hp
                }
            }

            display = new Display({x : p.position.x + p.width/2, y : p.position.y + p.height/2, 
                color : color, text : data.result, type : 'damage'})
            displays.push(display) 
        }

        if(data.type === 'set_good_status'){
            var damage = new Damage({
                x : undefined, y : undefined, 
                owner_id : undefined, owner : undefined, type : data.damage_type, side : undefined, 
                character_width : undefined, character_height: undefined, lastTimestamp : undefined
            })  

            var inner_p
            if(data.id == player_id){
                inner_p = player
            }else{
                inner_p = players.find(element => element.id == data.id)
            }

            inner_p.good_status = activateGoodStatus(inner_p.good_status, damage.good_status, data.sender_id ) 
        }

        if(data.type === 'set_bad_status'){
            var damage = new Damage({
                x : undefined, y : undefined, 
                owner_id : undefined, owner : undefined, type : data.damage_type, side : undefined, 
                character_width : undefined, character_height: undefined, lastTimestamp : undefined
            })  

            var inner_p
            if(data.id == player_id){
                inner_p = player
            }else{
                inner_p = players.find(element => element.id == data.id)
            }

            inner_p.bad_status = activateBadStatus(inner_p.bad_status, damage.bad_status, data.sender_id )            
        }
    
        if(data.type === 'first_connection'){
            player_id = data.id
            var json_obj = {
                'type' : 'login',
                'id' : player_id,
                'color' : data.color,
                'x' : 350,
                'y' : 700,
                'user_name' : user_name,
                'gender' : char_gender,
                'character_class' : character_class
            }
            connSend(json_obj)
        }

        if(data.type === 'login_complete'){
            player_id = data.id
            chat_output.append('Seu ID: ' + player_id, document.createElement('br'))
            player = new Player(player_id, data.user_name, lastTimestamp, data.x, data.y, data.color, data.gender, data.character_class)   
            
            if(data.state != ''){
                player.state = data.state
            }
            if(data.attributes_values != ''){
                player.attributes_values = data.attributes_values
            }
            if(data.good_status != ''){
                player.good_status = data.good_status
            }
            if(data.bad_status != ''){
                player.bad_status = data.bad_status
            }

            var json_obj = {
                'type' : 'login_complete'
            }
            connSend(json_obj)
            
            player.start = true
            start()

            login.style.display = 'none'
            chat.style.display = 'block'
            attributes.style.display = 'block'
            document.body.style.backgroundImage = 'none'

            updateAttributesUI()
        }

        if(data.type === 'login_wellcome'){
            var id = data.id
            chat_output.append(data.user_name + ' (' + id + ') entrou', document.createElement('br'))
            var p = new Player(id, data.user_name, lastTimestamp, data.x, data.y, data.color, data.gender, data.character_class)
            p.start = true
            players.push(p)
        }
    
        if(data.type === 'get_player'){
            var id = data.id
            chat_output.append('Encontrou ' + data.user_name + ' (' + data.id + ')', document.createElement('br'))
            var p = new Player(id, data.user_name, lastTimestamp, data.x, data.y, data.color, data.gender, data.character_class)
            p.start = true
            p.state = data.state
            p.attributes_values = data.attributes_values
            p.good_status = data.good_status
            players.push(p)
        }

        if(data.type === 'login_refused'){
            alert(data.message)
        }
    
        if(data.type === 'disconnection'){
            var id = data.id
            chat_output.append(data.user_name + ' (' + id + ')' + ' saiu', document.createElement('br'))
            var p = players.find(element => element.id == id)  
            p.start = false     
            players = players.filter(player => player.start == true)
        }
    })
}

function connSend(json_obj){

    if(conn.readyState == WebSocket.CLOSED){
        console.log('Disconnected')
        end_game = true
        return
    }

    if(conn.readyState == WebSocket.OPEN){
        conn.send(JSON.stringify(json_obj))
    }
}

function sendDamage(id, result, knockback_side, knockback_val, stamina_result, stun){
    
    var json_obj = {
        'type' : 'action_damage',
        'id' : id,
        'result' : result,
        'knockback_side' : knockback_side,
        'knockback_val' : knockback_val,
        'stamina_result': stamina_result,
        'stun': stun
    }
    //conn.send(JSON.stringify(json_obj))
    connSend(json_obj)
    //console.log('send dmg type:action_damage '+ ' from:'+player.id+' to:'+id)    
}

function sendDamageFinish(id, damage_id){
    
    var json_obj = {
        'type' : 'action_damage_finish',
        'id' : id,
        'damage_id' : damage_id,
    }
    //conn.send(JSON.stringify(json_obj))  
    connSend(json_obj)
}

function sendDamageUpdate(id, damage_id, side){
    
    var json_obj = {
        'type' : 'action_damage_update',
        'id' : id,
        'damage_id' : damage_id,
        'side' : side,
    }
    //conn.send(JSON.stringify(json_obj))  
    connSend(json_obj)
}

function sendBadStatus(id, sender_id, damage_type){
    
    var json_obj = {
        'type' : 'set_bad_status',
        'id' : id,
        'sender_id' : sender_id,
        'damage_type' : damage_type,
    }
    //conn.send(JSON.stringify(json_obj))  
    connSend(json_obj)
}

function sendGoodStatus(id, sender_id, damage_type){
    
    var json_obj = {
        'type' : 'set_good_status',
        'id' : id,
        'sender_id' : sender_id,
        'damage_type' : damage_type,
    }
    //conn.send(JSON.stringify(json_obj))  
    connSend(json_obj)
}

function sendRestore(id, result, restore_type){
    
    var json_obj = {
        'type' : 'action_restore',
        'id' : id,
        'result' : result,
        'restore_type' : restore_type
    }
    //conn.send(JSON.stringify(json_obj)) 
    connSend(json_obj)
}