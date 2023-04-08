const background_song = new sound("src/sound/35.mp3")
//var sword_sound = new sound("src/sound/sword_sound.wav")
// var sword_slash_sound = new sound("src/sound/sword_slash_sound.mp3")
// var power_sword_sound = new sound("src/sound/power_sword_sound.wav")
//var shield_sound = new sound("src/sound/shield_sound.wav")
// var rapid_blade = new sound("src/sound/rapid_blade.wav")
// var shield_grab_sond = new sound("src/sound/shield_grab_sond.wav")
const run_sound = new sound("src/sound/run_sound.wav")

let sound_count = 0
let timestamp_sound = 0

function sound(src) {
    this.sound = document.createElement("audio")
    this.sound.src = src
    this.sound.setAttribute("preload", "auto")
    this.sound.setAttribute("controls", "none")
    this.sound.style.display = "none"
    document.body.appendChild(this.sound)

    this.play = function(){
        this.sound.play();       
    }
    this.stop = function(){
        this.sound.pause()
    } 
}

function backgroundMusic(){
    background_song.play()
}

function swordSound(  ) {
    var sword_sound = new Audio("./src/sound/sword_sound.wav");
    sword_sound.play()
    sword_sound.onended = function(){
        sword_sound.currentSrc = null
        sword_sound.src = ""
        sword_sound.srcObject = null
        sword_sound.remove()
        sword_sound = null
    }
}

function swordSlashSound(){
    
    if(lastTimestamp - 80 > timestamp_sound){ 
        timestamp_sound = lastTimestamp 

        var sword_slash_sound = new Audio("./src/sound/_hit_dagger.wav")
        sword_slash_sound.play()
        sound_count++
        sword_slash_sound.onended = function(){
            sword_slash_sound.currentSrc = null
            sword_slash_sound.src = ""
            sword_slash_sound.srcObject = null
            sword_slash_sound.remove()
            sword_slash_sound = null
            sound_count--
        }        
    } 
    console.log('swordSlashSound')
}

function shieldSound(){
    var shield_sound = new Audio("src/sound/shield_sound.wav")
    shield_sound.play()
    shield_sound.onended = function(){
        shield_sound.currentSrc = null
        shield_sound.src = ""
        shield_sound.srcObject = null
        shield_sound.remove()
        shield_sound = null
    }
}

function powerSwordSound(){
    var power_blade_sound = new Audio("src/sound/power_blade_sound.wav")
    power_blade_sound.play()
    power_blade_sound.onended = function(){
        power_blade_sound.currentSrc = null
        power_blade_sound.src = ""
        power_blade_sound.srcObject = null
        power_blade_sound.remove()
        power_blade_sound = null
    }
}

function rapidBladeSound(){
    var rapid_blade = new Audio("src/sound/rapid_blade.wav")
    rapid_blade.play()
    rapid_blade.onended = function(){
        rapid_blade.currentSrc = null
        rapid_blade.src = ""
        rapid_blade.srcObject = null
        rapid_blade.remove()
        rapid_blade = null
    }
}

function shieldGrabSound(){
    var shield_grab_sound = new Audio("./src/sound/shield_grab_sound.wav")
    shield_grab_sound.play()
    shield_grab_sound.onended = function(){
        shield_grab_sound.currentSrc = null
        shield_grab_sound.src = ""
        shield_grab_sound.srcObject = null
        shield_grab_sound.remove()
        shield_grab_sound = null
    }
}

function runSound(){
    //var run_sound = new sound("src/sound/run_sound.wav")
    run_sound.play()
    run_sound.onended = function(){
        run_sound.currentSrc = null
        run_sound.src = ""
        run_sound.srcObject = null
        run_sound.remove()
        run_sound = null
    }
}

function runSoundStop(){
    run_sound.stop();   
    //run_sound = new sound("src/sound/run_sound.wav")
}

function screamSound(){
    var scream_sound = new Audio("./src/sound/scream_sound.wav")
    scream_sound.play()
    scream_sound.onended = function(){
        scream_sound.currentSrc = null
        scream_sound.src = ""
        scream_sound.srcObject = null
        scream_sound.remove()
        scream_sound = null
    }
}

function phantonBladeSound(){
    var phanton_blade_sound = new Audio("./src/sound/phanton_blade_sound.wav")
    phanton_blade_sound.play()
    phanton_blade_sound.onended = function(){
        phanton_blade_sound.currentSrc = null
        phanton_blade_sound.src = ""
        phanton_blade_sound.srcObject = null
        phanton_blade_sound.remove()
        phanton_blade_sound = null
    }
}

function cureSound(){
    var cure_sound = new Audio("./src/sound/cure_sound.wav")
    cure_sound.play()
    cure_sound.onended = function(){
        cure_sound.currentSrc = null
        cure_sound.src = ""
        cure_sound.srcObject = null
        cure_sound.remove()
        cure_sound = null
    }
}
