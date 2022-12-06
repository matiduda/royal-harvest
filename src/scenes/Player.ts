import { Container, AnimatedSprite, Ticker, Loader, SCALE_MODES } from "pixi.js";
import { Keyboard } from "./Keyboard"

export class Player extends Container {

    private readonly screenWidth: number;
    private readonly screenHeight: number;

    private clampy!: AnimatedSprite; // TODO: Check if this is correct

    private clampyVelocity: number = 0;
    private maxVelocity: number = 10;

    private currentPosition: number = 0;

    private playerScale = 2;

    constructor(screenWidth: number, screenHeight: number) {
        super();

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        const animationStand = Loader.shared.resources.player.spritesheet?.animations['knight iso char_idle'];

        if (animationStand === undefined) {
            console.log("Animation for the player is not loaded!");
            return;
        }

        this.clampy = new AnimatedSprite(animationStand);
        this.currentPosition = 0;
        this.clampy.anchor.set(0.5);
        this.clampy.x = this.screenWidth / 2;
        this.clampy.y = this.screenHeight * 0.9;

        this.clampy.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST

        this.clampy.scale.x = this.playerScale;
        this.clampy.scale.y = this.playerScale;

        this.clampy.animationSpeed = 0.1;
        this.clampy.play();

        Ticker.shared.add(this.update, this);

        this.addChild(this.clampy);

        new Keyboard();
        Keyboard.initialize();
    }

    private update(deltaTime: number): void {


        let speedUpDown: number = 3;

        let speedDiff = 0;

        if (Keyboard.state.get('ArrowRight')) {
            // Change player texture
            if (this.currentPosition != 1) {
                this.currentPosition = 1;
                const animationRight = Loader.shared.resources.player.spritesheet?.animations['knight iso char_run right'];
                if (animationRight !== undefined) {
                    this.clampy.textures = animationRight;
                    this.clampy.animationSpeed = 0.16;
                    this.clampy.play();
                }
            }

            if (Math.abs(this.clampyVelocity) <= this.maxVelocity) {
                speedDiff = speedUpDown;
            }
        }

        if (Keyboard.state.get('ArrowLeft')) {
            // Change player texture
            if (this.currentPosition != 2) {
                this.currentPosition = 2;
                const animationLeft = Loader.shared.resources.player.spritesheet?.animations['knight iso char_run left'];
                if (animationLeft !== undefined) {
                    this.clampy.textures = animationLeft;
                    this.clampy.animationSpeed = 0.16;

                    this.clampy.play();
                }
            }

            if (Math.abs(this.clampyVelocity) <= this.maxVelocity) {
                speedDiff = -speedUpDown;
            }

        }

        if (!Keyboard.state.get('ArrowLeft') && !Keyboard.state.get('ArrowRight')) {
            // Change player texture to default
            if (this.currentPosition != 0) {
                this.currentPosition = 0;
                const animationStand = Loader.shared.resources.player.spritesheet?.animations['knight iso char_idle'];
                if (animationStand !== undefined) {
                    this.clampy.textures = animationStand;
                    this.clampy.animationSpeed = 0.1;

                    this.clampy.play();
                }
            }

            // Slow player down   
            if (this.clampyVelocity > 0) {
                this.clampyVelocity -= speedUpDown;
            } else if (this.clampyVelocity < 0) {
                this.clampyVelocity += speedUpDown;
            }
        }


        this.clampyVelocity += speedDiff;
        this.clampy.x = this.clampy.x + this.clampyVelocity * deltaTime;

        // Woah there clampy, come back inside the screen!
        if (this.clampy.x > this.screenWidth) {
            this.clampy.x = 0;
        }

        if (this.clampy.x < 0) {
            this.clampy.x = this.screenWidth;

        }
    }
}