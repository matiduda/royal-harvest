import { Container, Loader, Resource, Sprite, TextStyle, Texture, Text } from "pixi.js";
import { Game } from "./Game";
import { SceneInterface } from "./SceneInterface";
import { Manager } from "./SceneManager";

export class Result extends Container implements SceneInterface {

    private startButton: Sprite;
    private textures: Texture<Resource>[] = [];

    private mainText: Text;
    private subText: Text;

    private background: Sprite;

    constructor(score: number) {
        super();

        this.background = Sprite.from('gradient');
        this.background.scale.x = 3.38;
        this.background.scale.y = 3.38;
        this.addChild(this.background);

        const mainStyle: TextStyle = new TextStyle({
            fontFamily: 'Courier New',
            fontSize: 45,
            fontWeight: 'bold',
            fill: 0x0F0F0F,
            align: 'center',
        });

        const subStyle: TextStyle = new TextStyle({
            fontFamily: 'Courier New',
            fontSize: 40,
            fill: 0x0F0F0F,
            align: 'center',
        });

        let message = '';

        if (score < 10) {
            message = 'Next time will be better!';
        } else if (score < 50) {
            message = 'The people of the kingdom thank you!';
        } else if (score < 100) {
            message = 'The people of the kingdom are impressed!';
        } else {
            message = 'We have enough food to last for years!';
        }

        this.mainText = new Text(`You collected ${String(score)} pieces of food`, mainStyle);

        this.mainText.anchor.set(0.5);
        this.mainText.x = Manager.width / 2;
        this.mainText.y = Manager.height * 0.4;

        this.subText = new Text(message, subStyle);

        this.subText.anchor.set(0.5);
        this.subText.x = Manager.width / 2;
        this.subText.y = Manager.height * 0.5;

        this.loadTextures();

        this.startButton = Sprite.from(this.textures[0]);

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

        this.addChild(this.mainText, this.subText, this.startButton);
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

    private onClick(): void {
        this.startButton.texture = this.textures[2];
    }

    private onPointerOver(): void {
        this.startButton.texture = this.textures[1];
    }

    private onPointerOut(): void {
        this.startButton.texture = this.textures[0];
    }

    private loadGame(): void {
        const game: Game = new Game();
        Manager.changeScene(game);
    }

    public update() { }
}