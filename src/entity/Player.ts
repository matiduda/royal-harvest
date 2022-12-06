import { Container, AnimatedSprite, Ticker, Loader, SCALE_MODES, Resource, Texture } from "pixi.js";
import { Manager } from "../scenes/SceneManager";
import { Keyboard } from "../helper/Keyboard"

export class Player extends Container {

    private animations: Texture<Resource>[][] = [];
    private player!: AnimatedSprite;

    private pose: number = 0;

    // Movement constants
    private velocity: number = 0;
    private velocityMax: number = 12;


    private playerScale: number = 2.5;

    private acceleration: number = 0;
    private accelerationDiff: number = 2;


    constructor() {
        super();

        try {
            this.loadPlayerAnimations();
        } catch (Error) {
            console.error(Error);
            return;
        }

        this.player = new AnimatedSprite(this.animations[0]);
        this.player.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST

        this.player.anchor.set(0.5);

        this.player.x = Manager.width / 2;
        this.player.y = Manager.height * 0.9;


        this.player.scale.x = this.playerScale;
        this.player.scale.y = this.playerScale;

        Ticker.shared.add(this.update, this);

        this.addChild(this.player);

        new Keyboard();
        Keyboard.initialize();
    }


    private loadPlayerAnimations() {
        const animationNames = [
            'knight iso char_idle',
            'knight iso char_run right',
            'knight iso char_run left'
        ];

        animationNames.forEach(name => {
            const anim = Loader.shared.resources.player.spritesheet?.animations[name];

            if (!anim) {
                throw new Error("Player assets not loaded");
                return;
            }

            this.animations.push(anim);
        });
    }

    private update(deltaTime: number): void {

        this.acceleration = 0;

        if (Keyboard.state.get('ArrowRight')) {
            // Change player texture
            if (this.pose != 1) {
                this.pose = 1;
                this.player.textures = this.animations[1];
                this.player.animationSpeed = 0.16;
                this.player.play();
            }

            this.acceleration = this.accelerationDiff;
        } else if (Keyboard.state.get('ArrowLeft')) {
            // Change player texture
            if (this.pose != 2) {
                this.pose = 2;
                this.player.textures = this.animations[2];
                this.player.animationSpeed = 0.16;
                this.player.play();
            }

            this.acceleration = -this.accelerationDiff;
        }

        if (!Keyboard.state.get('ArrowLeft') && !Keyboard.state.get('ArrowRight') || Keyboard.state.get('ArrowLeft') && Keyboard.state.get('ArrowRight')) {
            // Change player texture to default
            if (this.pose != 0) {
                this.pose = 0;
                this.player.textures = this.animations[0];
                this.player.animationSpeed = 0.1;
                this.player.play();
            }

            this.acceleration = 0;

            // Slow player down   
            if (this.velocity > 0) {
                this.velocity -= this.accelerationDiff;
            } else if (this.velocity < 0) {
                this.velocity += this.accelerationDiff;
            }
        }

        if (Math.abs(this.velocity) > this.velocityMax) {
            this.acceleration = 0;
        }

        this.velocity += this.acceleration;
        this.player.x = this.player.x + this.velocity * deltaTime;

        // Woah there clampy, come back inside the screen!
        if (this.player.x > Manager.width) {
            this.player.x = 0;
        }

        if (this.player.x < 0) {
            this.player.x = Manager.width;
        }
    }
}