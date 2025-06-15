const background = document.getElementById('background')
const context = background.getContext('2d')

// background.width = 800
// background.height = 800

var end_game = false

const perfectFrameTime = 1000 / 60
let deltaTime = 0
let lastTimestamp = 0
let lastTimestamp2 = 0
let framerate = 0
let last_framerate = 0

let lastTimestamp_tax = 0
let recep_tax = 0
let send_tax = 0
let last_recep_tax = 0
let last_send_tax = 0

var player
var player_last_x
var player_last_y
var player_last_walking
var player_last_running
var player_last_attacking
var player_last_defending
var player_last_attributes_values = {
    hp : 0,
    stamina : 0
}

var player_last_good_status = {
    damage_transfer_id : 0,
    damage_transfer : 0
}

var player_last_bad_status = {
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

var last_keys_attack_pressed

var players = new Array()
var weapons = new Array()
var damages = new Array()
var displays = new Array()

var hud

function start() {  
    requestAnimationFrame(animate)
    hud = new Hud({id : 'player'})
}

function end(){
    context.fillStyle = '#ffffff88'
    context.fillRect(0, 0, 800, 800) 

    context.font = "32px Arial"
    context.fillStyle = 'red'
    context.fillText('Sem conexão',300,400)
}

function animate(timestamp){
    if(end_game) return end()        

    requestAnimationFrame(animate)
    lastTimestamp = timestamp

    context.clearRect(0, 0, background.width, background.height)  
    context.closePath() 
    background.width = 800
    background.height = 800

    if(!padLoop()){
        keypadLoop()
    }

    var layer = new Array() 
    player.update()
    layer.push(player)

    //player.draw()

    players.forEach(element => {
        element.updateOther()
        layer.push(element)
        //element.draw()
    });

    weapons.forEach(weapon => {
        if(weapon.side == 'up'){
            weapon.update() 
        }      
    })

    layer.sort((a,b) => a.position.y - b.position.y)
    layer.forEach(element => element.draw())

    weapons = weapons.filter(weapon => weapon.frames <= 3)
    weapons.forEach(weapon => {
        if(weapon.side != 'up'){
            weapon.update() 
        }      
    })

    damages.forEach(damage => { 
        damage_action(damage)         
        damage.update() 
    })
    //to remove finished damages 
    damages = damages.filter(damage => damage.finished == false)

    displays.forEach(display => {
        display.draw()
        display.time -= 1
        if(display.time <= 0){
            displays = displays.filter(display => display.time > 0)
        }
    })

    hud.draw()     

    if(lastTimestamp - 1000 > lastTimestamp2){       
        lastTimestamp2 = lastTimestamp    
        last_framerate = framerate
        framerate = 0

        last_recep_tax = recep_tax
        recep_tax = 0
        
        last_send_tax = send_tax
        send_tax = 0 
    }
    framerate++
    
    if(lastTimestamp - 10 > lastTimestamp_tax){ 
        lastTimestamp_tax = lastTimestamp         
        sendUpdates()
    }    

    debug()
}

function sendUpdates(){

    if(conn.readyState != WebSocket.OPEN){
        console.log('Disconnected')
        end_game = true
        return
    }

    if(player_last_x != player.position.x || player_last_y != player.position.y || 

        player_last_walking !=  player.state.walking || player_last_running !=  player.state.running || 
        player_last_attacking !=  player.state.attacking || player_last_defending !=  player.state.defending ||
        player_last_attributes_values.hp != player.attributes_values.hp ||
        player_last_attributes_values.sp != player.attributes_values.sp ||
        player_last_attributes_values.stamina != player.attributes_values.stamina ||

        //player_last_good_status != player.good_status ||
        player_last_good_status.damage_transfer_id != player.good_status.damage_transfer_id ||
        player_last_good_status.damage_transfer != player.good_status.damage_transfer ||

        //player_last_bad_status != player.bad_status
        player_last_bad_status.stun != player.bad_status.stun ||

        player_last_bad_status.wet != player.bad_status.wet ||        
        player_last_bad_status.cold != player.bad_status.cold ||

        player_last_bad_status.heat != player.bad_status.heat || 
        player_last_bad_status.burn_id != player.bad_status.burn_id ||
        player_last_bad_status.burn != player.bad_status.burn ||

        player_last_bad_status.dirty != player.bad_status.dirty ||        
        player_last_bad_status.petrification != player.bad_status.petrification ||
        
        player_last_bad_status.breeze != player.bad_status.breeze || 
        player_last_bad_status.electrification_id != player.bad_status.electrification_id ||
        player_last_bad_status.electrification != player.bad_status.electrification
        ){           

        var json_obj = {
            'type' : 'action',
            'x' : player.position.x,
            'y' : player.position.y,
            'state' : player.state,
            'attributes_values' : player.attributes_values,
            'good_status' : player.good_status,
            'bad_status' : player.bad_status
        }

        connSend(json_obj)

        player_last_x = player.position.x
        player_last_y = player.position.y
        player_last_walking = player.state.walking
        player_last_running = player.state.running
        player_last_attacking = player.state.attacking
        player_last_defending = player.state.defending
        //player_last_state = player.state
        player_last_attributes_values.hp = player.attributes_values.hp
        player_last_attributes_values.sp = player.attributes_values.sp
        player_last_attributes_values.stamina = player.attributes_values.stamina

        player_last_good_status.damage_transfer_id = player.good_status.damage_transfer_id
        player_last_good_status.damage_transfer = player.good_status.damage_transfer

        player_last_bad_status.stun = player.bad_status.stun 

        player_last_bad_status.wet = player.bad_status.wet
        player_last_bad_status.cold = player.bad_status.cold
        
        player_last_bad_status.heat = player.bad_status.heat
        player_last_bad_status.burn_id = player.bad_status.burn_id 
        player_last_bad_status.burn = player.bad_status.burn 
        
        player_last_bad_status.dirty = player.bad_status.dirty
        player_last_bad_status.petrification = player.bad_status.petrification

        player_last_bad_status.breeze = player.bad_status.breeze
        player_last_bad_status.electrification_id = player.bad_status.electrification_id 
        player_last_bad_status.electrification = player.bad_status.electrification

        send_tax++
    }
}

function square_colision_area(a, b){
    if(
        a.position.x < b.position.x + b.width &&
        a.position.x + a.width > b.position.x &&
        a.position.y < b.position.y + b.height &&
        a.position.y + a.height > b.position.y
    ){
        return true
    }

    return false
}

function createImage(imageSrc){
    const image = new Image()
    image.src = imageSrc
    return image
}

function debug(){    

    //area
    context.fillStyle = '#ffffff88'
    context.fillRect(0, 0, 120, 100) 

    context.font = "12px Arial"
    context.fillStyle = 'black'
    context.fillText('Time:'+clock(),5,20)
    context.fillText('framerate:'+last_framerate,5,40)
    //context.fillText('s_count:'+sound_count,2,50)
    //context.fillText('ws_conn:'+conn.readyState,2,50)
    context.fillText('weapon_count:'+weapons.length,5,60)
    context.fillText('damage_count:'+damages.length,5,70)
    context.fillText('recep_tax:'+last_recep_tax,5,80)
    context.fillText('send_tax:'+last_send_tax,5,90)

}

function random_area(height, width){
    var random_x = Math.round(Math.random() * ((background.width - width) - 0 + 1) + 0)
    var random_y = Math.round(Math.random() * ((background.height - height) - 0 + 1) + 0)

    var coord = {
        x : random_x,
        y : random_y
    }
    
    //console.log(coord)

    return coord
}

function clock(){
    var total_sec = Math.round(lastTimestamp /1000)  
    total_min = parseInt((total_sec/60),10)
    var sec = total_sec - total_min*60

    var total_hour = parseInt((total_min/60),10)
    var min = total_min - total_hour*60

    if(sec < 10){
        sec = '0'+sec
    }

    if(min < 10){
        min = '0'+min
    }

    return total_hour+':'+min+':'+sec
}

function updateAttributesUI() {
  if (player) {
    document.getElementById('for-value').textContent = player.attributes.power;
    document.getElementById('agi-value').textContent = player.attributes.agility;
    document.getElementById('des-value').textContent = player.attributes.dexterity;
    document.getElementById('vit-value').textContent = player.attributes.vitality;
    document.getElementById('int-value').textContent = player.attributes.inteligence;

    document.getElementById('av-max_hp').textContent = parseFloat(player.attributes_values.max_hp).toFixed(0);
    document.getElementById('av-max_sp').textContent = parseFloat(player.attributes_values.max_sp).toFixed(0);
    document.getElementById('av-max_stamina').textContent = parseFloat(player.attributes_values.max_stamina).toFixed(0);
    document.getElementById('av-hp').textContent = parseFloat(player.attributes_values.hp).toFixed(0);
    document.getElementById('av-sp').textContent = parseFloat(player.attributes_values.sp).toFixed(0);
    document.getElementById('av-stamina').textContent = parseFloat(player.attributes_values.stamina).toFixed(0);

    document.getElementById('av-attack').textContent = parseFloat(player.attributes_values.attack).toFixed(2);
    document.getElementById('av-defense').textContent = parseFloat(player.attributes_values.defense).toFixed(2);
    document.getElementById('av-flee').textContent = parseFloat(player.attributes_values.flee).toFixed(2);
    document.getElementById('av-accuracy').textContent = parseFloat(player.attributes_values.accuracy).toFixed(2);
    document.getElementById('av-m_attack').textContent = parseFloat(player.attributes_values.m_attack).toFixed(2);
    document.getElementById('av-m_defense').textContent = parseFloat(player.attributes_values.m_defense).toFixed(2);
    document.getElementById('av-speed').textContent = parseFloat(player.attributes_values.speed).toFixed(2);
    document.getElementById('av-attack_speed').textContent = parseFloat(player.attributes_values.attack_speed).toFixed(2);
    document.getElementById('av-hp_recovery').textContent = parseFloat(player.attributes_values.hp_recovery).toFixed(2);
    document.getElementById('av-sp_recovery').textContent = parseFloat(player.attributes_values.sp_recovery).toFixed(2);
  }
}