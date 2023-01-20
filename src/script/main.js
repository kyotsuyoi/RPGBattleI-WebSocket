const background = document.getElementById('background')
const context = background.getContext('2d')

background.width = 800
background.height = 800

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

//var player = new Player('', lastTimestamp, 0, 0)
var player
var player_last_x
var player_last_y
var player_last_walking
var player_last_running
var player_last_attacking
var player_last_defending
var last_keys_attack_pressed

var player_last_attributes_values = {
    hp : 0,
    stamina : 0
}

var players = new Array()
var weapons = new Array()
var damages = new Array()
var displays = new Array()

var hud

function start() {  
    requestAnimationFrame(animate)
    hud = new Hud({id : 'player'})
}

function animate(timestamp){

    requestAnimationFrame(animate)
    lastTimestamp = timestamp

    context.clearRect(0, 0, background.width, background.height)  
    context.closePath() 

    padLoop()
    keypadLoop()

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
        last_framerate = framerate - 1
        framerate = 0

        last_recep_tax = recep_tax
        recep_tax = 0
        
        last_send_tax = send_tax
        send_tax = 0 
    }
    framerate++
    
    if(lastTimestamp - 33 > lastTimestamp_tax){ 
        lastTimestamp_tax = lastTimestamp         
        sendUpdates()
    }    

    debug()
}

function sendUpdates(){
    if(player_last_x != player.position.x || player_last_y != player.position.y || 
        player_last_walking !=  player.state.walking || player_last_running !=  player.state.running || 
        player_last_attacking !=  player.state.attacking || player_last_defending !=  player.state.defending ||
        player_last_attributes_values.hp != player.attributes_values.hp ||
        player_last_attributes_values.stamina != player.attributes_values.stamina){

        var json_attributes_values = {
            'hp' : player.attributes_values.hp,
            'stamina' : player.attributes_values.stamina
        }

        var json_obj = {
            'type' : 'action',
            'x' : player.position.x,
            'y' : player.position.y,
            'side' : player.state.side,
            'walking' : player.state.walking,
            'running' : player.state.running,
            'attacking' : player.state.attacking,
            'defending' : player.state.defending,
            'attributes_values' : json_attributes_values
        }

        conn.send(JSON.stringify(json_obj))

        player_last_x = player.position.x
        player_last_y = player.position.y
        player_last_walking = player.state.walking
        player_last_running = player.state.running
        player_last_attacking = player.state.attacking
        player_last_defending = player.state.defending
        player_last_attributes_values.hp = player.attributes_values.hp
        player_last_attributes_values.stamina = player.attributes_values.stamina

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
    
    var sec_t = Math.round(lastTimestamp /1000)  
    var min = parseInt((sec_t/60),10)
    var sec = sec_t - min*60

    if(sec < 10){
        sec = '0'+sec
    }

    //area
    context.fillStyle = '#ffffff88'
    context.fillRect(0, 0, 120, 100) 

    context.font = "12px Arial"
    context.fillStyle = 'black'
    context.fillText('Time:'+min+':'+sec,5,20)
    context.fillText('framerate:'+last_framerate,5,40)
    //context.fillText('s_count:'+sound_count,2,50)
    context.fillText('weapon_count:'+weapons.length,5,60)
    context.fillText('damage_count:'+damages.length,5,70)
    context.fillText('recep_tax:'+last_recep_tax,5,80)
    context.fillText('send_tax:'+last_send_tax,5,90)

}