import { Container, Sprite, Texture, Loader } from "pixi.js";
import { Manager } from "../scenes/SceneManager";

export class Fruit extends Container {

    private fruit!: Sprite;

    private velocity: number;
    private fruitScale: number = 4.5;
    private velocityMax: number = 7;

    private readonly spawnBorder = 50;

    constructor(initialVelocity: number = 3) {
        super();

        this.initFruit();
        this.respawn();

        this.fruit.anchor.set(0.5);
        this.fruit.scale.x = this.fruitScale;
        this.fruit.scale.y = this.fruitScale;
        this.velocity = initialVelocity;

        this.addChild(this.fruit);
    }

    public getHeight() {
        return this.fruit.y;
    }

    public updatePosition(deltaTime: number): void {
        if (this.velocity < this.velocityMax) {
            this.velocity += 0.002 * deltaTime;
        }

        this.fruit.y = this.fruit.y + this.velocity;
    }

    private initFruit() {
        let textures = Loader.shared.resources.food.textures
        let result;
        let count = 0;
        for (let prop in textures)
            if (Math.random() < 1 / ++count)
                result = prop;

        if (result) {
            const texture = Texture.from(result);
            this.fruit = Sprite.from(texture);
        }
    }

    public respawn() {
        let textures = Loader.shared.resources.food.textures
        let result;
        let count = 0;
        for (let prop in textures)
            if (Math.random() < 1 / ++count)
                result = prop;

        if (result) {
            const texture = Texture.from(result);
            this.fruit.texture = texture;
        }

        this.fruit.x = this.spawnBorder + Math.random() * (Manager.width - 2 * this.spawnBorder);
        this.fruit.y = -Manager.height * 0.1;
    }
}