import { Container, Rectangle, Sprite } from "pixi.js";
import { Manager } from "../scenes/SceneManager";
import { Keyboard } from "./Keyboard";

export class TouchArea extends Container {

    private left: Sprite;
    private right: Sprite;

    constructor() {
        super();

        this.left = new Sprite();
        this.left.hitArea = new Rectangle(0, 0, Manager.width / 2, Manager.height);
        this.left.interactive = true;
        this.left.buttonMode = true;

        this.left.on('touchstart', () => this.leftPressed());
        this.left.on('touchend', () => this.leftDone());

        this.right = new Sprite();
        this.right.hitArea = new Rectangle(Manager.width / 2, 0, Manager.width / 2, Manager.height);
        this.right.interactive = true;
        this.right.buttonMode = true;

        this.right.on('touchstart', () => this.rightPressed());
        this.right.on('touchend', () => this.rightDone());

        this.addChild(this.left, this.right);
    }

    private leftPressed() {
        Keyboard.state.set('ArrowLeft', true);

    }

    private leftDone() {
        Keyboard.state.set('ArrowLeft', false);
    }

    private rightPressed() {
        Keyboard.state.set('ArrowRight', true);
    }

    private rightDone() {
        Keyboard.state.set('ArrowRight', false);
    }
}