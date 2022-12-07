import { Container, Sprite, Texture, Loader } from "pixi.js";
import { Manager } from "../scenes/SceneManager";

export class Clouds extends Container {

    private clouds: Sprite[] = [];

    private velocity: number;
    private maxHeight: number;
    private cloudScale: number = 6;

    constructor(n: number = 10, velocity: number = 3, maxHeight: number = 1) {
        super();

        this.velocity = velocity;
        this.maxHeight = maxHeight;

        this.spawnClouds(n);

        this.clouds.forEach(cloud => {

            cloud.x = Math.random() * Manager.width;
            cloud.y = Math.random() * (Manager.height * this.maxHeight - cloud.height);

            cloud.scale.x = this.cloudScale;
            cloud.scale.y = this.cloudScale;

            this.addChild(cloud);
        });
    }

    private spawnClouds(n: number): void {
        for (let i = 0; i < n; i++) {
            let textures = Loader.shared.resources.cloud.textures
            let result;
            let count = 0;
            for (let prop in textures)
                if (Math.random() < 1 / ++count)
                    result = prop;

            if (result) {
                const texture = Texture.from(result);
                const cloud = Sprite.from(texture);
                this.clouds.push(cloud);
            }
        }
    }

    public updatePosition(): void {
        this.clouds.forEach(cloud => {

            if (cloud.x > Manager.width + cloud.width) {
                cloud.x = -cloud.width;
                cloud.y = Math.random() * (Manager.height * this.maxHeight - cloud.height);
            }

            cloud.x += this.velocity;
        });

    }
}