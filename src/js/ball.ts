import { Vector } from "./vector";
import { GameObject } from "./gameObject";
import { GameEngine } from "./index";
import { Player } from "./player";

export class Ball implements GameObject
{
    public height: number;
    public width: number;
    private gameEngine:GameEngine;
    public position:Vector;
    public direction:Vector;
    public speed:number = 160;
    private size:number= 10;
    public radius:number = this.size/2.5;
    public highScoreElement = (document.getElementById("highScore") as HTMLDivElement);
    public highScore = 0;
    public divPos = (document.getElementById("ballY") as HTMLDivElement);

    constructor (position:Vector, gameEngine:GameEngine)
    {
        this.position = position;
        this.direction = new Vector(0.7, 1);
        this.gameEngine = gameEngine;
        this.height = this.size;
        this.width = this.size;
    }

    // Update method takes care of all logic
    update(time: number): void {
        //Ball Y-Pos for debugging - uncomment to see div element
        //this.divPos.textContent = "Ball Y-Pos : " + this.position.y.toString();
        //adjusts ball pos to avoid getting stuck in edges
            if (this.position.y < 4) {
                this.position.y += 2;
            }
            if (this.position.y > this.gameEngine.canvasHeight-10){
                this.position.y -= 2;
            } 
        //testing for collisions with walls -> change direction
        if (this.position.x <=4 ||this.position.x >= this.gameEngine.canvasWidth-this.size-4) this.direction.x *= -1;
        if (this.position.y <=5 ||this.position.y >= this.gameEngine.canvasHeight-10) this.direction.y *= -1;

        //testing for Collision with any gameobject
        this.gameEngine.objects.forEach(elegameobj => {
           
    
        });
               
        this.position.x += this.direction.x * this.speed * time/1000;
        this.position.y += this.direction.y * this.speed * time/1000;
    }
    
    // draw circle ball on canvas
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, (Math.PI / 180) * 360);
          ctx.fillStyle = "white";
          ctx.closePath();
          ctx.fill();
        //ctx.fillRect(this.position.x, this.position.y, this.size, this.size); //Square ball, old
    }
    
    // in case of any collision this method is called
    onColliosion(other: GameObject): void {
        // reverse direction if player collides with ball
        if (other == this.gameEngine.player1 || other == this.gameEngine.player2)
        {
            //In AI Mode player get points for every collision with ball
            if (other == this.gameEngine.player1 && Player.playMode == "vsAi")
            {
                GameEngine.points++;
                //Set high score
                if (+this.highScore < GameEngine.points && Player.playMode == "vsAi")
                {
                    this.highScore = GameEngine.points;
                    document.getElementById("highScore").textContent = "High Score : " + GameEngine.points.toString();
                }
            }
            if (Player.playMode == "vsBlocks")
            {
                if (+this.highScore < GameEngine.points)
                {
                    this.highScore = GameEngine.points;
                    document.getElementById("highScore").textContent = "High Score : " + GameEngine.points.toString();
                }
            }
            //else if (other == this.gameEngine.player2)
            //{
            //    GameEngine.points2++;
            //}

            this.direction.x *= -1;
        }
        //Increases speed of ball and AI opponent for every score point
        if (other == this.gameEngine.player1 || other == this.gameEngine.player2)
        {
            this.speed *= 1.05;
            if (Player.playMode == "vsAi")
            {
                this.gameEngine.player2.speed *= 1.05;
            }
        }

        


    }

}