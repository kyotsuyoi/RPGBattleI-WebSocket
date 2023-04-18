
const input = document.querySelector('input')
const output = document.querySelector('output')

const chat = document.getElementById('chat')
const button_send = document.getElementById('button_send')

const login = document.getElementById('login')
const button_user_name = document.getElementById('button_user_name')
const checkbox_char_gender = document.getElementById('checkbox_char_gender')
const checkbox_char_class = document.getElementById('checkbox_char_class')
var char_gender, character_class

var button_user_name_click_count = 0

var player_id

chat.style.visibility = 'hidden'

// conn.addEventListener('open', console.log)
// conn.addEventListener('message', console.log)

var conn = null

input.addEventListener('keypress', e =>{
    if (e.code === 'Enter'){
        send_message()
    }            
})

button_send.addEventListener("click", send_message)

function send_message() {
    const text = input.value
    if (text === ''){
        return
    }
    if(text.substring(0,6)=='code:>'){
        var code = text.substring(6,10)
        switch (code){
            case 'pow:':
                var value = Number(text.replace('code:>pow:',''))
                player.attributes.power = value
            break
            case 'agi:':
                var value = Number(text.replace('code:>agi:',''))
                player.attributes.agility = value
            break
            case 'dex:':
                var value = Number(text.replace('code:>dex:',''))
                player.attributes.dexterity = value
            break
            case 'vit:':
                var value = Number(text.replace('code:>vit:',''))
                player.attributes.vitality = value
            break
            case 'int:':
                var value = Number(text.replace('code:>int:',''))
                player.attributes.inteligence = value
            break
            case 'deb:':
                var value = text.replace('code:>deb:','')
                if(value=='player') player.is_debug = !player.is_debug
            break
        }
        player.setAttributesValues()
        player.setMessage('CODE RUNNER')
        return
    }
    output.append('Eu (' + player_id + '): ' + text, document.createElement('br'))
    //let json = JSON.parse('{ "type":"chat" , "text":"' + value + '" }')
    conn.send('{ "type":"chat" , "text":"' + text + '" }')
    input.value = ''

    player.setMessage(text)
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
    char_gender = checkbox_char_gender.options[checkbox_char_gender.selectedIndex].value
    character_class = checkbox_char_class.options[checkbox_char_class.selectedIndex].value
    button_user_name_click_count++  
    setConnection(value)  
}

function setConnection(user_name){
    //conn = new WebSocket('wss://websocket-test-rpg-game.glitch.me/')
    conn = new WebSocket('ws://10.0.0.103:8085')
    conn.addEventListener('message', message => {
        const data = JSON.parse(message.data)

        recep_tax ++

        if(data.type === 'chat'){
            output.append(data.user_name +' (' + data.id + '): ' + data.text, document.createElement('br'))
            var p = players.find(element => element.id == data.id)
            p.setMessage(data.text)
        }
    
        if(data.type === 'action'){
            var id = data.id
            var p = players.find(element => element.id == id)
            if(p != undefined){
                p.position.x = data.x
                p.position.y = data.y
                p.state.side = data.side
                p.state.walking = data.walking
                p.state.running = data.running
                p.state.attacking = data.attacking
                p.state.defending = data.defending
                p.attributes_values = data.attributes_values
                p.good_status = data.good_status
            }
            //console.log('def:'+data.defending)
        }
    
        if(data.type === 'action_attack'){
            var id = data.id
            var attack_type = data.attack_type
            var p = players.find(element => element.id == id)
            p.attributes_values = data.attributes_values
            
            weapon = new Weapon({x : p.position.x, y : p.position.y, owner_id : id, 
                type : p.skill.primary_weapon_type, side : p.state.side})
            weapons.push(weapon)  

            damage = new Damage({
                x : p.position.x, y : p.position.y, 
                owner_id : p.id, owner : 'player', type : attack_type, side : p.state.side, 
                character_width : p.width, character_height: p.height, lastTimestamp : lastTimestamp
            })               
            damages.push(damage)                 
        }

        if (data.type === 'action_damage'){
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
                
                setRumble('damage')
            }

            if(data.result > 0){
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

        if(data.type === 'action_retore'){
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
            if(data.retore_type === 'area_cure'){
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
    
        if(data.type === 'first_connection'){
            player_id = data.id
            output.append('Seu ID: ' + player_id, document.createElement('br'))
            player = new Player(player_id, user_name, lastTimestamp, 350, 700, data.color, char_gender, character_class)
            player.start = true
            start()

            var json_obj = {
                'type' : 'login',
                'id' : player_id,
                'x' : player.position.x,
                'y' : player.position.y,
                'user_name' : user_name,
                'gender' : char_gender,
                'character_class' : character_class
            }

            conn.send(JSON.stringify(json_obj))

            login.style.visibility = 'hidden'
            chat.style.visibility = 'visible'
        }
    
        if(data.type === 'first_connection_wellcome'){
            var id = data.id
            output.append(data.user_name + ' (' + data.id + ') entrou', document.createElement('br'))
            var p = new Player(id, data.user_name, lastTimestamp, 350, 700, data.color, data.gender, data.character_class)
            p.start = true
            players.push(p)
        }
    
        if(data.type === 'get_player'){
            var id = data.id
            output.append('Encontrou ' + data.user_name + ' (' + data.id + ')', document.createElement('br'))
            var p = new Player(id, data.user_name, lastTimestamp, data.x, data.y, data.color, data.gender, data.character_class)
            p.start = true
            p.state.side = data.side
            p.state.defending = data.defending            
            p.good_status = data.defending
            players.push(p)
        }
    
        if(data.type === 'disconnection'){
            var id = data.id
            output.append(id + ' saiu', document.createElement('br'))
            var p = players.find(element => element.id == id)  
            p.start = false     
            players = players.filter(player => player.start == true)
        }
    })
}

