import { Container, AnimatedSprite, Ticker, Texture } from "pixi.js";
import { Keyboard } from "./Keyboard"

export class Scene extends Container {

    private readonly screenWidth: number;
    private readonly screenHeight: number;

    private clampy: AnimatedSprite;
    private clampyVelocity: number = 0;
    constructor(screenWidth: number, screenHeight: number) {
        super();

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        // This is an array of strings, we need an array of Texture
        const clampyFrames: Array<string> = [
            'player/knight iso char_idle_0.png',
            'player/knight iso char_idle_1.png',
            'player/knight iso char_idle_2.png',
            'player/knight iso char_idle_3.png'
        ];

        // `array.map()` creates an array from another array by doing something to each element.
        // `(stringy) => Texture.from(stringy)` means
        // "A function that takes a string and returns a Texture.from(that String)"
        this.clampy = new AnimatedSprite(clampyFrames.map((stringy) => Texture.from(stringy)));
        // (if this javascript is too much, you can do a simple for loop and create a new array with Texture.from())


        this.clampy.anchor.set(0.5);
        this.clampy.x = 0; // we start it at 0
        this.clampy.y = this.screenHeight / 2;
        this.addChild(this.clampy);

        this.clampy.animationSpeed = 0.05;
        this.clampy.play();
        // See the `, this` thingy there? That is another way of binding the context!
        Ticker.shared.add(this.update, this);

        new Keyboard();
        Keyboard.initialize()
    }

    private update(deltaTime: number): void {

        if (Keyboard.state.get('ArrowRight')) {
            this.clampyVelocity += 0.1;
        } else if (Keyboard.state.get('ArrowLeft')) {
            this.clampyVelocity -= 0.1;
        } else if (this.clampyVelocity > 0) {
            this.clampyVelocity -= 0.1;
        } else if (this.clampyVelocity < 0) {
            this.clampyVelocity += 0.1;
        }

        this.clampy.x = this.clampy.x + this.clampyVelocity * deltaTime;

        if (this.clampy.x > this.screenWidth) {
            // Woah there clampy, come back inside the screen!
            this.clampy.x = 0;
        }
    }
}