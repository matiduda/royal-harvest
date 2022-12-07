import { Container, Loader, Resource, Sprite, Texture } from "pixi.js";
import { Game } from "./Game";
import { Sound } from "@pixi/sound";
import { SceneInterface } from "./SceneInterface";
import { Manager } from "./SceneManager";
import { Clouds } from "../entity/Clouds";

export class Menu extends Container implements SceneInterface {

    private logo: Sprite;
    private logoTexture!: Texture<Resource>;

    private readonly logoDiffMax: number = 15;
    private logoDiff: number = 0;
    private logoSpeed: number = -0.1;

    private clouds: Clouds;

    private startButton: Sprite;
    private startButtonTextures: Texture<Resource>[] = [];

    private background: Sprite;

    private music: Sound;

    constructor() {
        super();

        try {
            this.loadButtonTextures();
        } catch (Error) {
            console.log(Error);
        }

        // Start button
        this.startButton = Sprite.from(this.startButtonTextures[0]);

        this.startButton.anchor.set(0.5);
        this.startButton.x = Manager.width / 2;
        this.startButton.y = Manager.height * 0.65;
        this.startButton.scale.x = 7;
        this.startButton.scale.y = 7;

        this.startButton.interactive = true;
        this.startButton.buttonMode = true;

        this.startButton.on('pointerdown', () => this.onClick());
        this.startButton.on('pointerover', () => this.onPointerOver());
        this.startButton.on('pointerup', () => this.loadGame());
        this.startButton.on('pointerout', () => this.onPointerOut());

        // Background
        this.background = Sprite.from('gradient');
        this.background.scale.x = 3.38;
        this.background.scale.y = 3.38;
        this.addChild(this.background);

        // Logo
        this.logo = Sprite.from(this.logoTexture);
        this.logo.anchor.set(0.5);
        this.logo.x = Manager.width / 2;
        this.logo.y = Manager.height * 0.3 + this.logoDiffMax;
        this.logo.scale.x = 6;
        this.logo.scale.y = 6;

        // Menu music
        this.music = Sound.from(Loader.shared.resources["menu"]);
        this.music.volume = 0.2;
        this.music.loop = true;
        this.music.play();

        this.clouds = new Clouds()

        this.addChild(this.clouds);
        this.addChild(this.startButton);
        this.addChild(this.logo);
    }

    public update(): void {
        if (Math.abs(this.logoDiff) >= this.logoDiffMax) {
            this.logoSpeed *= -1;
        }
        this.logo.y += this.logoSpeed;
        this.logoDiff += this.logoSpeed;

        this.clouds.updatePosition();
    }

    private loadGame(): void {
        this.music.stop();

        const game: Game = new Game();
        Manager.changeScene(game);
    }

    private loadButtonTextures(): void {
        const buttonNames: string[] = [
            'normal.png',
            'hover.png',
            'pressed.png'
        ];

        const textureSource = Loader.shared.resources.button.textures;
        const logoSource = Loader.shared.resources.logo.texture;

        if (!textureSource || !logoSource) {
            throw new Error("Menu assets not loaded");
        }

        buttonNames.forEach(name => {
            this.startButtonTextures.push(textureSource[name]);
        });

        this.logoTexture = logoSource;
    }

    private onPointerOut(): void {
        this.startButton.texture = this.startButtonTextures[0];
    }

    private onPointerOver(): void {
        this.startButton.texture = this.startButtonTextures[1];
    }

    private onClick(): void {
        this.startButton.texture = this.startButtonTextures[2];
    }
}