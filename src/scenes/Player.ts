import { Container, AnimatedSprite, Ticker, Loader } from "pixi.js";
import { Keyboard } from "./Keyboard"

export class Player extends Container {

    private readonly screenWidth: number;
    private readonly screenHeight: number;

    private clampy!: AnimatedSprite; // TODO: Check if this is correct
    private clampyVelocity: number = 0;
    private maxVelocity: number = 15;

    constructor(screenWidth: number, screenHeight: number) {
        super();

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        const animation = Loader.shared.resources.player.spritesheet?.animations['knight iso char_idle']

        if (animation === undefined) {
            console.log("Animation for the player is not loaded!");
            return;
        }

        this.clampy = new AnimatedSprite(animation);

        this.clampy.anchor.set(0.5);
        this.clampy.x = this.screenWidth / 2;
        this.clampy.y = this.screenHeight * 0.9;

        this.clampy.animationSpeed = 0.05;
        this.clampy.play();
        // See the `, this` thingy there? That is another way of binding the context!
        Ticker.shared.add(this.update, this);

        this.addChild(this.clampy);

        new Keyboard();
        Keyboard.initialize();
    }

    private update(deltaTime: number): void {

        let speedUpDown: number = 2;
        if (Math.abs(this.clampyVelocity) < this.maxVelocity) {
            if (Keyboard.state.get('ArrowRight')) {
                this.clampyVelocity += speedUpDown;
            } else if (Keyboard.state.get('ArrowLeft')) {
                this.clampyVelocity -= speedUpDown;
            } else if (this.clampyVelocity > 0) {
                this.clampyVelocity -= speedUpDown;
            } else if (this.clampyVelocity < 0) {
                this.clampyVelocity += speedUpDown;
            }
        } else if (Keyboard.state.get('ArrowRight') === false) {
            if (this.clampyVelocity > 0) {
                this.clampyVelocity -= speedUpDown;
            } else if (this.clampyVelocity < 0) {
                this.clampyVelocity += speedUpDown;
            }
        }

        this.clampy.x = this.clampy.x + this.clampyVelocity * deltaTime;

        if (this.clampy.x > this.screenWidth) {
            // Woah there clampy, come back inside the screen!
            this.clampy.x = 0;
        }

        if (this.clampy.x < 0) {
            this.clampy.x = this.screenWidth;

        }
    }
}