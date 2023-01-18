class Display{
    constructor({x, y, color, text, type}){
        this.position ={
            x,
            y
        }
        this.width = 42
        this.height = 42
        this.time = 50

        this.color = color
        this.text = text
        this.type = type
        
        if(type == 'hp'){
            this.time = 0
        }

    }

    draw(){

        if(this.type == 'damage'){
            context.font = "20px Arial Black";
            context.fillStyle = 'black';
            context.fillText(this.text,this.position.x+2,this.position.y+2);

            context.font = "20px Arial Black";
            context.fillStyle = this.color;
            context.fillText(this.text,this.position.x,this.position.y);
            
            this.position.x += 1
            this.position.y -= 1
        }

        if(this.type == 'hp'){
            context.font = "12px Arial";
            context.fillStyle = 'black';
            context.fillText(this.text,this.position.x+1,this.position.y+1);

            context.font = "12px Arial";
            context.fillStyle = this.color;
            context.fillText(this.text,this.position.x,this.position.y);
        }
    }
}