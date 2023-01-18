class Weapon{
    constructor({x, y, owner_id, type, side}){
        this.position ={
            x,
            y
        }
        this.velocity={
            x : 0,
            y : 0
        }
        this.width = 60
        this.height = 60
        this.speed = 0.6

        this.frames = 0
        this.count = 0
        this.time = 10

        this.owner_id = owner_id

        var sprite = undefined
        switch(type){
            case 'sword_1':
                sprite = createImage('src/image/sword_1.png')
                break
            case 'sword_2':
                sprite = createImage('src/image/sword_2.png')
                break
        }

        this.sprites = {            
            sprite : sprite,
            cropWidth : 60,
            width : this.width            
        }

        this.currentSprite = this.sprites.sprite
        this.currentCropWidth = 60
        this.currentCropHeight = 0

        this.side = side
        switch (side){
            case 'up':
                this.position.x = (x + 32 /2) - (this.height/2)
                this.position.y = y - this.height + 15
                this.currentCropHeight = 60*2
            break

            case 'down':
                this.position.x = (x + 32 /2) - (this.height/2)
                this.position.y = y + 32 - 15              
                this.currentCropHeight = 60*3
            break

            case 'left':
                this.position.x = x - this.width + 15
                this.position.y = this.position.y = (y + 32 /2) - (this.height/2) 
                this.currentCropHeight = 0
            break

            case 'right':
                this.position.x = x + 32 - 15
                this.position.y = (y + 32 /2) - (this.height/2)                
                this.currentCropHeight = 60
            break
        }
    }

    draw(){
        // context.fillStyle = 'red'
        // context.fillRect(this.position.x, this.position.y, this.width, this.height)

        context.drawImage(          
            this.currentSprite, 
            this.currentCropWidth * this.frames,
            this.currentCropHeight,
            this.currentCropWidth, //largura
            60, //altura
            this.position.x, 
            this.position.y - 10,
            this.width,
            this.height
        )
    }

    update(){
        this.count++
        if (this.count==3 || this.count==6 || this.count==9 || this.count==12){
            this.frames++
        }

        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}