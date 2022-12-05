import { Container, Ticker, Sprite } from "pixi.js";
import { Keyboard } from "./Keyboard"

export class Fruit extends Container {

    private readonly screenWidth: number;
    private readonly screenHeight: number;

    private clampy: Sprite;
    private clampyVelocity: number = 5;

    constructor(screenWidth: number, screenHeight: number) {
        super();

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        this.clampy = Sprite.from('fruits/Apple.png');

        this.clampy.anchor.set(0.5);
        this.clampy.x = Math.random() * this.screenWidth;
        this.clampy.y = this.screenHeight * 0.1;

        this.clampy.scale.x = 3;
        this.clampy.scale.y = 3;
        // See the `, this` thingy there? That is another way of binding the context!
        Ticker.shared.add(this.update, this);

        this.addChild(this.clampy);

        new Keyboard();
        Keyboard.initialize();
    }

    private update(): void {

        this.clampy.y = this.clampy.y + this.clampyVelocity;

        if (this.clampy.y > this.screenHeight) {
            this.clampy.x = Math.random() * this.screenWidth;
            this.clampy.y = this.screenHeight * 0.1;
        }
    }

    public respawn() {
        this.clampy.x = Math.random() * this.screenWidth;
        this.clampy.y = this.screenHeight * 0.1;
    }
}