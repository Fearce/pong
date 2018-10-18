import { Vector } from "./vector";
import { GameObject } from "./gameObject";
import { GameEngine } from "./index";

export class Block implements GameObject
{   
    public position:Vector 
    private gameEngine:GameEngine;
    public BlockNumber: number;
    public speed:number = 160;
    public height:number = 20;
    public width:number = 10;
    

    constructor(position:Vector, gameEngine:GameEngine,blockNumber:number)
    {
        this.position = position;
        this.gameEngine = gameEngine;
        this.BlockNumber = blockNumber;
    }

    update(time: number): void {

    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    onColliosion(other: GameObject): void {
        if(other == this.gameEngine.ball)
        {
            this.gameEngine.ball.direction.x *= -1;
            //this.gameEngine.ball.position.x -=6;
            this.position.x = 40000;
            GameEngine.points++;
        }
        // not doing anything at the moment...
    }
}