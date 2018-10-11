import { GameObject } from "./gameObject";
import { Framerate } from "./framerate";
import { Vector } from "./vector";
import { Player } from "./player";
import { Ball } from "./ball";

/*
    THis is the main PONG GAME script
*/

export class GameEngine
{
    public static points:number;
    public static tries:number;
    // items in the game
    public ball:Ball;
    public player1:Player;
    public player2:Player;
 
    // canvas info
    public canvasWidth:number;
    public canvasHeight:number;

    // keep track of key states
    public aKey:boolean;
    public qKey:boolean;
    public oKey:boolean;
    public lKey:boolean;

    private canvas:HTMLCanvasElement;
    private ctx:CanvasRenderingContext2D;
    
    // array with all gameobjects in the game - If you want more objects in the game add them to this array!
    public objects:GameObject[] = new Array<GameObject>();

    // kepp track of time between loops
    private date: Date = new Date();
    private timeZero: number = this.date.getTime();
    private timeNow: number;

    constructor()
    {
        this.canvas = <HTMLCanvasElement> document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;

        GameEngine.points = 0;
        GameEngine.tries = 0;

        // listen for keyboard input
        document.addEventListener('keyup', this.keyUp.bind(this));
        document.addEventListener('keydown', this.keyDown.bind(this));

        //ceate gameobjects
        this.objects.push(new Framerate(new Vector(10,10)));
        
        this.player1 = new Player(new Vector(20,10), this,1);
        this.player2 = new Player(new Vector(this.canvasWidth-40,10), this,2);
        this.objects.push(this.player1);
        this.objects.push(this.player2);

        this.ball = new Ball(new Vector(this.canvasWidth/2, this.canvasHeight/2), this);
        this.objects.push(this.ball);

        this.gameLoop();
    }

    // keyboard event
    private keyDown(event:KeyboardEvent): void
    {
        if (event.repeat) {return};
        switch (event.key) {
            case "a":
                this.aKey = true;
                break;
            case "q":
                this.qKey = true;
                break;
            case "o":
                this.oKey = true;
                break;
            case "l":
                this.lKey = true;
        }
    }

    // keyboard event
    private keyUp(event: KeyboardEvent): void
    {
        switch (event.key) {
            case "a":
                this.aKey = false;
                break;
            case "q":
                this.qKey = false;
                break;
            case "o":
                this.oKey = false;
                break;
            case "l":
                this.lKey = false;
        }   
    } 
    
    // a very good explanation of how rectangular collision works: https://silentmatt.com/rectangle-intersection/
    private Collide(a:GameObject, b:GameObject): boolean {
        if (a.position.x < (b.position.x+b.width) &&
            (a.position.x+a.width) > b.position.x &&
            a.position.y < (b.position.y+b.height) &&
            a.position.y+a.height > b.position.y)
            {
                return true;
            }
        
    }

    // the main game loop
    private gameLoop()
    {
        // clear the screen in every update
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.date = new Date();
        this.timeNow = this.date.getTime()
        var time = this.timeNow-this.timeZero;
        this.timeZero=this.timeNow;

        // run throght all objects
        this.objects.forEach(element => {
            //all objects are tested for collisions on all objects
            this.objects.forEach(other => {  
                if (element !== other)
                {
                    if (this.Collide(element, other))
                    {
                        element.onColliosion(other);
                    }
                }
            });

            //Check for loss and reset Score&Speed
            if (this.ball.position.x < this.player1.position.x)
            {
                GameEngine.tries++;
                GameEngine.points = 0;
                this.ball.position.x = this.canvasWidth/2;
                this.ball.speed = 160;
                this.player2.speed = 160;
                document.getElementById("amountTries").textContent = "Deaths : " + GameEngine.tries.toString();
            }
            
            //every element is updated
            element.update(time);
            
            // every element is drawn on canvas
            element.draw(this.ctx);
        });
        
        // call the main gamelop again (~60fps by default)
        window.requestAnimationFrame(this.gameLoop.bind(this));



    }
}

//start gameengine
new GameEngine();

