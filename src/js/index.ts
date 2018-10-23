import { GameObject } from "./gameObject";
import { Framerate } from "./framerate";
import { Vector } from "./vector";
import { Player } from "./player";
import { Block } from "./block";
import { Ball } from "./ball";

/*
    THis is the main PONG GAME script
    Todo: 
        Fix CircleToRectangle collission (ball med players) - done
        Add intro screen instead of dropdown
        Player 2 score on playMode.value = "vsPlayer"
        PowerUps:
            Multiple balls
            Speed reset
            Opposing player slow down
            More points

        

*/

export class GameEngine {
    public static points: number;
    public static points2: number;
    public static tries: number;
    // items in the game
    public ball: Ball;
    public player1: Player;
    public player2: Player;

    // canvas info
    public framerate: Framerate;
    public canvasWidth: number;
    public canvasHeight: number;

    // keep track of key states
    public aKey: boolean;
    public qKey: boolean;
    public oKey: boolean;
    public lKey: boolean;
    public oneKey: boolean;
    public twoKey: boolean;
    public threeKey: boolean;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    // array with all gameobjects in the game - If you want more objects in the game add them to this array!
    public objects: GameObject[] = new Array<GameObject>();

    // array with all blocks
    public blocks: Block[] = new Array<Block>();


    // kepp track of time between loops
    private date: Date = new Date();
    private timeZero: number = this.date.getTime();
    private timeNow: number;

    //Intro Frames
    private frameOne: Framerate;
    private frameTwo: Framerate;
    private frameThree: Framerate;

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;

        GameEngine.points = 0;
        GameEngine.points2 = 0;
        GameEngine.tries = 0;

        for (var i = 0; i < 25; i++) {
            var y = -50
            var x = this.canvasWidth - 30
            var block = new Block(new Vector(x, y), this, i)
            this.blocks.push(block);
            this.objects.push(block);
        }


        // listen for keyboard input
        document.addEventListener('keyup', this.keyUp.bind(this));
        document.addEventListener('keydown', this.keyDown.bind(this));

        //ceate gameobjects 
        this.framerate = new Framerate(new Vector(10, 10));
        this.objects.push(this.framerate);

        //Introscreen (using framerates because why not)
        this.frameOne = new Framerate(new Vector(this.canvasWidth / 2 - 40, 40), "Press 1 for single-player", true);
        this.frameTwo = new Framerate(new Vector(this.canvasWidth / 2 - 40, 60), "Press 2 for multi-player", true);
        this.frameThree = new Framerate(new Vector(this.canvasWidth / 2 - 40, 80), "Press 3 for blocks", true);
        this.objects.push(this.frameOne);
        this.objects.push(this.frameTwo);
        this.objects.push(this.frameThree);

        this.player1 = new Player(new Vector(20, 10), this, 1);
        this.player2 = new Player(new Vector(this.canvasWidth - 30, 10), this, 2);
        this.objects.push(this.player1);
        this.objects.push(this.player2);

        this.ball = new Ball(new Vector(this.canvasWidth / 2, this.canvasHeight / 2), this);
        this.objects.push(this.ball);

        this.gameLoop();
    }

    // keyboard event
    private keyDown(event: KeyboardEvent): void {
        if (event.repeat) { return };
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
                break;
            case "1":
                this.oneKey = true;
                break;
            case "2":
                this.twoKey = true;
                break;
            case "3":
                this.threeKey = true;
                break;
        }
    }

    // keyboard event
    private keyUp(event: KeyboardEvent): void {
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
                break;
            case "1":
                this.oneKey = false;
                break;
            case "2":
                this.twoKey = false;
                break;
            case "3":
                this.threeKey = false;
                break;
        }
    }


    private RectCircleColliding(circle: Ball, rect: GameObject): boolean {
        var distX = Math.abs(circle.position.x - rect.position.x - rect.width / 2);
        var distY = Math.abs(circle.position.y - rect.position.y - rect.height / 2);

        if (distX > (rect.width / 2 + circle.radius)) { return false; }
        if (distY > (rect.height / 2 + circle.radius)) { return false; }

        if (distX <= (rect.width / 2)) { return true; }
        if (distY <= (rect.height / 2)) { return true; }

        var dx = distX - rect.width / 2;
        var dy = distY - rect.height / 2;
        return (dx * dx + dy * dy <= (circle.radius * circle.radius));
    }
    // a very good explanation of how rectangular collision works: https://silentmatt.com/rectangle-intersection/

    private Collide(a: GameObject, b: GameObject): boolean {
        if (a.position.x < (b.position.x + b.width) &&
            (a.position.x + a.width) > b.position.x &&
            a.position.y < (b.position.y + b.height) &&
            a.position.y + a.height > b.position.y) {
            return true;
        }

    }

    // the main game loop
    private gameLoop() {
        //Sets the next playmode
        if (Player.playMode == "None") {
            document.getElementById("highScore").innerText = "";
            document.getElementById("amountTries").innerText = "";
            this.framerate.position.x = 40000;
            this.ball.position.x = 40000;
            this.player1.position.x = 40000;
            this.player2.position.x = 40000;
            this.objects.forEach(e => { e.draw(this.ctx) });

            if (this.oneKey) {
                Player.playMode = "vsAi";
                this.frameOne.position.x = 40000;
                this.frameTwo.position.x = 40000;
                this.frameThree.position.x = 40000;
                GameEngine.points = 0;
                GameEngine.points2 = 0;
                this.ball.speed = 160;
                this.player2.speed = 160;
                this.player1.speed = 160;
                this.framerate.position.x = 10;
                this.ball.position.x = this.canvasWidth / 2;
                this.player1.position.x = 20;
                this.player2.position.x = this.canvasWidth - 30;
                this.blocks.forEach(element => { element.position.x = 4000; });
            }
            else if (this.twoKey) {
                Player.playMode = "vsPlayer";
                this.frameOne.position.x = 40000;
                this.frameTwo.position.x = 40000;
                this.frameThree.position.x = 40000;
                GameEngine.points = 0;
                GameEngine.points2 = 0;
                this.ball.speed = 160;
                this.player2.speed = 160;
                this.player1.speed = 160;
                this.framerate.position.x = 10;
                this.ball.position.x = this.canvasWidth / 2;
                this.player1.position.x = 20;
                this.player2.position.x = this.canvasWidth - 30;
                this.blocks.forEach(element => { element.position.x = 4000; });
            }
            else if (this.threeKey) {
                Player.playMode = "vsBlocks";
                this.frameOne.position.x = 40000;
                this.frameTwo.position.x = 40000;
                this.frameThree.position.x = 40000;
                this.player2.position.x = 40000;
                GameEngine.points = 0;
                GameEngine.points2 = 0;
                this.ball.speed = 160;
                this.player2.speed = 160;
                this.player1.speed = 160;
                this.framerate.position.x = 10;
                this.ball.position.x = this.canvasWidth / 2;
                this.player1.position.x = 20;
                this.blocks.forEach(element => {
                    if (element.BlockNumber < 5) {
                        var x = this.canvasWidth - 30
                        var y = this.canvasHeight - (36 * element.BlockNumber + 40)
                    }
                    else if (element.BlockNumber >= 5 && element.BlockNumber < 10) {
                        x = this.canvasWidth - 45
                        y = this.canvasHeight - (36 * (element.BlockNumber - 5) + 40)
                    }
                    else if (element.BlockNumber >= 10 && element.BlockNumber < 15) {
                        x = this.canvasWidth - 60
                        y = this.canvasHeight - (36 * (element.BlockNumber - 10) + 40)
                    }
                    else if (element.BlockNumber >= 15 && element.BlockNumber < 20) {
                        x = this.canvasWidth - 75
                        y = this.canvasHeight - (36 * (element.BlockNumber - 15) + 40)
                    }
                    else if (element.BlockNumber >= 20) {
                        x = this.canvasWidth - 90
                        y = this.canvasHeight - (36 * (element.BlockNumber - 20) + 40)
                    }
                    element.position.x = x;
                    element.position.y = y;
                });
                //this.player2.position.x = this.canvasWidth-30;
            }
        }
        //When PlayMode is set run normal gameloop
        else {
            //console.log(Player.playMode)
            // clear the screen in every update
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.date = new Date();
            this.timeNow = this.date.getTime()
            var time = this.timeNow - this.timeZero;
            this.timeZero = this.timeNow;

            // run throght all objects
            this.objects.forEach(element => {
                //all objects are tested for collisions on all objects
                this.objects.forEach(other => {
                    if (element !== other && element != this.ball) //R2R collision
                    {
                        if (this.Collide(element, other)) {
                            element.onColliosion(other);
                        }
                    }
                    if (element !== other && element == this.ball) //R2C collision
                    {
                        if (this.RectCircleColliding(this.ball, other)) {
                            element.onColliosion(other);
                        }
                    }
                });

                //Makes sure ball is never out of bounds
                if (Player.playMode != "None") {
                    if (this.ball.position.x > this.canvasWidth || this.ball.position.y > this.canvasHeight) {
                        this.ball.position.x = this.canvasWidth / 2;
                        this.ball.position.y = this.canvasHeight / 2;
                    }
                }


                //Check for loss and reset Score&Speed
                if (this.ball.position.x < this.player1.position.x + 12 && Player.playMode == "vsAi") {
                    GameEngine.tries++;
                    GameEngine.points = 0;
                    GameEngine.points2 = 0;
                    this.ball.position.x = this.canvasWidth / 2;
                    this.ball.speed = 160;
                    this.player2.speed = 160;
                    this.player1.speed = 160;
                    document.getElementById("amountTries").textContent = "Deaths : " + GameEngine.tries.toString();
                }
                //
                else if (Player.playMode == "vsPlayer" && this.ball.position.x < this.player1.position.x + 12) {
                    GameEngine.points2++;
                    this.ball.position.x = this.canvasWidth / 2;
                    this.ball.speed = 160;
                    this.ball.direction.x *= -1;
                }
                else if (Player.playMode == "vsPlayer" && this.ball.position.x > this.player2.position.x) {
                    GameEngine.points++;
                    this.ball.position.x = this.canvasWidth / 2;
                    this.ball.speed = 160;
                    this.ball.direction.x *= -1;
                }
                else if (this.ball.position.x < this.player1.position.x + 12 && Player.playMode == "vsBlocks") {
                    GameEngine.tries++;
                    GameEngine.points = 0;
                    GameEngine.points2 = 0;
                    this.ball.position.x = this.canvasWidth / 2;
                    this.ball.speed = 160;
                    this.player2.speed = 160;
                    this.player1.speed = 160;
                    document.getElementById("amountTries").textContent = "Deaths : " + GameEngine.tries.toString();
                }

                //Reset blocks for infinite gameplay
                if (Player.playMode == "vsBlocks" && GameEngine.points % 25 === 0) {
                    this.blocks.forEach(element => {
                        if (element.BlockNumber < 5) {
                            var x = this.canvasWidth - 30
                            var y = this.canvasHeight - (36 * element.BlockNumber + 40)
                        }
                        else if (element.BlockNumber >= 5 && element.BlockNumber < 10) {
                            x = this.canvasWidth - 45
                            y = this.canvasHeight - (36 * (element.BlockNumber - 5) + 40)
                        }
                        else if (element.BlockNumber >= 10 && element.BlockNumber < 15) {
                            x = this.canvasWidth - 60
                            y = this.canvasHeight - (36 * (element.BlockNumber - 10) + 40)
                        }
                        else if (element.BlockNumber >= 15 && element.BlockNumber < 20) {
                            x = this.canvasWidth - 75
                            y = this.canvasHeight - (36 * (element.BlockNumber - 15) + 40)
                        }
                        else if (element.BlockNumber >= 20) {
                            x = this.canvasWidth - 90
                            y = this.canvasHeight - (36 * (element.BlockNumber - 20) + 40)
                        }
                        element.position.x = x;
                        element.position.y = y;
                    });
                }

                //every element is updated
                element.update(time);

                // every element is drawn on canvas
                element.draw(this.ctx);
            });
        }

        if (Player.playMode == "vsBlocks") {
            this.blocks.forEach(e => {
                e.update(time);
                e.draw(this.ctx);
            });
        }



        // call the main gamelop again (~60fps by default)
        window.requestAnimationFrame(this.gameLoop.bind(this));



    }


}
//start gameengine
new GameEngine();
