import { Container, Sprite, Texture, Loader, Resource } from "pixi.js";
import { Manager } from "../scenes/SceneManager";

export class Food extends Container {

    private fruit!: Sprite;

    private velocity: number;
    private fruitScale: number = 4.5;
    private velocityMax: number = 7;

    private readonly spawnBorder: number = 50;

    private foodTextures!: { [name: string]: Texture<Resource>; };

    constructor(initialVelocity: number = 3) {
        super();

        try {
            this.loadFoodTextures();
        } catch (Error) {
            console.error(Error);
        }

        this.respawn();

        this.fruit.anchor.set(0.5);
        this.fruit.scale.x = this.fruitScale;
        this.fruit.scale.y = this.fruitScale;
        this.velocity = initialVelocity;

        this.addChild(this.fruit);
    }

    public getHeight(): number {
        return this.fruit.y;
    }

    public updatePosition(deltaTime: number): void {
        if (this.velocity < this.velocityMax) {
            this.velocity += 0.002 * deltaTime;
        }
        this.fruit.y = this.fruit.y + this.velocity;
    }

    private loadFoodTextures(): void {
        const resource = Loader.shared.resources.food.textures;

        if (!resource) {
            throw new Error('Food assets not loaded');
        }

        this.foodTextures = resource;

        let randomTexture!: string;
        let count: number = 0;

        for (let texture in this.foodTextures)
            if (Math.random() < 1 / ++count)
                randomTexture = texture;

        if (randomTexture) {
            const texture = Texture.from(randomTexture);
            this.fruit = Sprite.from(texture);
        } else {
            throw new Error('Food assets not loaded');
        }
    }

    public respawn(): void {
        let randomTexture!: string;
        let count: number = 0;

        for (let texture in this.foodTextures)
            if (Math.random() < 1 / ++count)
                randomTexture = texture;

        const texture = Texture.from(randomTexture);
        this.fruit.texture = texture;
        this.fruit.x = this.spawnBorder + Math.random() * (Manager.width - 2 * this.spawnBorder);
        this.fruit.y = -Manager.height * 0.1;
    }
}