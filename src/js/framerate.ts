import {Vector} from './vector';
import { GameObject } from './gameObject';
import { GameEngine } from "./index";
import { Player } from './player';

/*
    this class makes a fps counter to show how often the game refreshes
*/
export class Framerate implements GameObject
{
    points: number;
    height: number;
    width: number;
    message: string;
    intro: boolean;
    onColliosion(other: GameObject): void {
    }
   
    constructor(position: Vector, msg?:string, temp?:boolean)
    {
        this.position = position;
        this.message = msg;
        this.intro = temp;
    }

    public position:Vector;
    private time: number;
    update(time: number): void {
        this.time = time;
    }


    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#ffffff";
        if (Player.playMode == "vsAi" || Player.playMode == "vsBlocks")
        {
            ctx.fillText(""+Math.round(1000/this.time) + "fps  " + "Score: " + +GameEngine.points, this.position.x, this.position.y);
        }
        else if (Player.playMode == "vsPlayer")
        {
            ctx.fillText(""+Math.round(1000/this.time) + "fps  " + "Score: " + +GameEngine.points + "                                                    Score: " + +GameEngine.points2, this.position.x, this.position.y);
        }
        else if (Player.playMode == "None")
        {
            ctx.font="12px Georgia";
            ctx.fillText(this.message,this.position.x, this.position.y);
        }

    }
}

