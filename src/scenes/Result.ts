import { Container, Loader, Resource, Sprite, TextStyle, Texture, Text } from "pixi.js";
import { Game } from "./Game";
import { SceneInterface } from "./SceneInterface";
import { Manager } from "./SceneManager";

export class Result extends Container implements SceneInterface {

    private startButton: Sprite;
    private textures: Texture<Resource>[] = [];

    private text;

    constructor(score: number) {
        super();

        const styly: TextStyle = new TextStyle({
            fontFamily: 'Courier New',
            fontSize: 55,
            fontWeight: 'bold',
            fill: 0x0F0F0F,
            align: 'center',
        });

        this.text = new Text(`You picked ${String(score)} fruits. Your kingdom thanks you!`, styly); // Text supports unicode!

        this.text.anchor.set(0.5);
        this.text.x = Manager.width / 2;
        this.text.y = Manager.height * 0.1;

        this.addChild(this.text);

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

        this.addChild(this.startButton);
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
        const game: Game = new Game();
        Manager.changeScene(game);
    }

    public update() {
    }
}