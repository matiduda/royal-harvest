import { Container, Loader, Resource, Sprite, Texture } from "pixi.js";
import { Game } from "./Game";
import { Sound } from "@pixi/sound";
import { SceneInterface } from "./SceneInterface";
import { Manager } from "./SceneManager";

export class Menu extends Container implements SceneInterface {

    private startButton: Sprite;
    private textures: Texture<Resource>[] = [];

    private logo: Sprite;
    private logoTexture!: Texture<Resource>;

    private menuTheme: Sound;

    private logoDiff: number = 0;
    private readonly logoDiffMax: number = 15;
    private logoSpeed: number = -0.1;

    constructor() {
        super();

        this.menuTheme = Sound.from(Loader.shared.resources["menu"]);
        this.menuTheme.volume = 0.2;
        this.menuTheme.loop = true;
        this.menuTheme.play();

        this.loadTextures();

        this.startButton = Sprite.from(this.textures[0]);

        // Set the initial position
        this.startButton.anchor.set(0.5);
        this.startButton.x = Manager.width / 2;
        this.startButton.y = Manager.height * 0.65;

        this.startButton.scale.x = 7;
        this.startButton.scale.y = 7;

        // Opt-in to interactivity
        this.startButton.interactive = true;

        // Shows hand cursor
        this.startButton.buttonMode = true;

        // Pointers normalize touch and mouse
        this.startButton.on('pointerdown', () => this.onClick());
        this.startButton.on('pointerover', () => this.onPointerOver());
        this.startButton.on('pointerup', () => this.loadGame());
        this.startButton.on('pointerout', () => this.onPointerOut());

        this.logo = Sprite.from(this.logoTexture);
        this.logo.anchor.set(0.5);
        this.logo.x = Manager.width / 2;
        this.logo.y = Manager.height * 0.3 + this.logoDiffMax;
        this.logo.scale.x = 6;
        this.logo.scale.y = 6;

        this.addChild(this.startButton);
        this.addChild(this.logo);
    }

    private loadTextures() {
        const buttonNames = [
            'normal.png',
            'hover.png',
            'pressed.png'
        ];

        buttonNames.forEach(name => {
            const buttonSource = Loader.shared.resources.button.textures;

            if (!buttonSource) {
                throw new Error("Button assets not loaded");
                return;
            }

            this.textures.push(buttonSource[name]);
        });

        const logoSource = Loader.shared.resources.logo.texture;
        if (!logoSource) {
            throw new Error("Logo not loaded");
            return;
        }

        this.logoTexture = logoSource;
    }

    private onClick() {
        this.startButton.texture = this.textures[2];
    }

    private onPointerOver() {
        this.startButton.texture = this.textures[1];
    }

    private onPointerOut() {
        this.startButton.texture = this.textures[0];
    }

    private loadGame() {
        this.menuTheme.stop();

        const game: Game = new Game();
        Manager.changeScene(game);
    }

    public update() {
        // Move logo
        if (Math.abs(this.logoDiff) >= this.logoDiffMax) {
            this.logoSpeed *= -1;
        }

        this.logo.y += this.logoSpeed;
        this.logoDiff += this.logoSpeed;
    }
}