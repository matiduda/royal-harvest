import { Container, AnimatedSprite, Ticker, Loader, Resource, Texture, Graphics, Rectangle } from "pixi.js";
import { Manager } from "../scenes/SceneManager";
import { Keyboard } from "../helper/Keyboard"

export class Player extends Container {

    private animations: Texture<Resource>[][] = [];
    private player: AnimatedSprite;

    public hitbox: Graphics;

    private pose: number = 0;

    // Movement constants
    private velocity: number = 0;
    private velocityMax: number = 12;

    private playerScale: number = 2.5;

    private acceleration: number = 0;
    private accelerationDiff: number = 1;

    constructor() {
        super();

        try {
            this.loadPlayerAnimations();
        } catch (Error) {
            console.error(Error);
        }

        this.player = new AnimatedSprite(this.animations[0]);
        this.player.anchor.set(0.5);

        this.player.x = Manager.width / 2;
        this.player.y = Manager.height - this.player.height * 1.9;

        this.player.scale.x = this.playerScale;
        this.player.scale.y = this.playerScale;

        let b = this.player.getBounds();
        this.player.hitArea = new Rectangle(b.x, b.y, 20, 20)

        const hitboxWidthOffset = 60;
        const hitboxHeightOffset = 30;

        this.hitbox = new Graphics();
        this.hitbox.drawRect(
            -this.player.width / 2 + hitboxWidthOffset,
            -this.player.height / 2 + hitboxHeightOffset,
            this.player.width - 2 * hitboxWidthOffset,
            this.player.height - hitboxHeightOffset
        );

        Ticker.shared.add(this.update, this);
        this.addChild(this.player);
        this.addChild(this.hitbox);
    }

    private loadPlayerAnimations(): void {
        const animationNames = [
            'knight iso char_idle',
            'knight iso char_run right',
            'knight iso char_run left'
        ];

        animationNames.forEach(name => {
            const anim = Loader.shared.resources.player.spritesheet?.animations[name];

            if (!anim) {
                throw new Error("Player assets not loaded");
            }

            this.animations.push(anim);
        });
    }

    private update(deltaTime: number): void {

        this.acceleration = 0;

        // Change player state
        if (Keyboard.state.get('ArrowRight')) {
            if (this.pose != 1) {
                this.pose = 1;
                this.player.textures = this.animations[1];
                this.player.animationSpeed = 0.16;
                this.player.play();
            }

            if (Math.abs(this.velocity) < this.velocityMax) {
                this.acceleration = this.accelerationDiff;
            }
        } else if (Keyboard.state.get('ArrowLeft')) {
            // Change player texture
            if (this.pose != 2) {
                this.pose = 2;
                this.player.textures = this.animations[2];
                this.player.animationSpeed = 0.16;
                this.player.play();
            }
        } else {
            // Change player texture to default
            if (this.pose != 0) {
                this.pose = 0;
                this.player.textures = this.animations[0];
                this.player.animationSpeed = 0.1;
                this.player.play();
            }
        }

        switch (this.pose) {
            case 0: { // Standing

                // Slow player down   
                if (Math.abs(this.velocity) > 0) {
                    if (this.velocity > 0) {
                        this.acceleration = -this.accelerationDiff;
                    } else if (this.velocity < 0) {
                        this.acceleration = this.accelerationDiff;
                    }
                }
                break;
            }
            case 1: { // Moving right
                // Speed player up   
                if (this.velocity + this.accelerationDiff <= this.velocityMax) {
                    this.acceleration = this.accelerationDiff;
                }
                break;
            }
            case 2: { // Moving left
                // Speed player up   
                if (-(this.velocity + this.accelerationDiff) <= this.velocityMax) {
                    this.acceleration = -this.accelerationDiff;
                }
                break;
            }
        }

        this.velocity += this.acceleration;
        this.player.x = this.player.x + this.velocity * deltaTime;

        if (this.player.x > Manager.width) {
            this.player.x = 0;
        }

        if (this.player.x < 0) {
            this.player.x = Manager.width;
        }

        this.hitbox.position = this.player.position;
    }
}