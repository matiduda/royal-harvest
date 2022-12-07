import { Container, DisplayObject, Loader } from "pixi.js";
import { Sound } from "@pixi/sound";
import { SceneInterface } from "./SceneInterface";
import { Fruit } from "../entity/Fruit";
import { Player } from "../entity/Player";
import { Manager } from "./SceneManager";
import { HealthBar } from "../entity/HealthBar";
import { PowerBar } from "../entity/PowerBar";
import { Score } from "../entity/Score";
import { Result } from "./Result";
import { Keyboard } from "../helper/Keyboard";
import { TouchArea } from "../helper/TouchArea";

export class Game extends Container implements SceneInterface {

    private player: Player;

    private score: Score;

    private healthBar: HealthBar;
    private powerBar: PowerBar;

    private fruits: Fruit[] = new Array<Fruit>();

    private musicTheme: Sound;

    private chime: Sound;
    private success: Sound;
    private miss: Sound;
    private gameOver: Sound;

    private readonly maxFruitCount = 6;

    constructor() {
        super();

        this.musicTheme = Sound.from(Loader.shared.resources["theme"]);
        this.musicTheme.volume = 0.2;
        this.musicTheme.loop = true;
        this.musicTheme.play();

        this.player = new Player();
        this.addChild(this.player);

        this.score = new Score();
        this.addChild(this.score);

        this.healthBar = new HealthBar();
        this.addChild(this.healthBar);

        this.powerBar = new PowerBar();
        this.addChild(this.powerBar);

        this.addFruit();

        this.chime = Sound.from(Loader.shared.resources["chime"]);
        this.success = Sound.from(Loader.shared.resources["success"]);
        this.miss = Sound.from(Loader.shared.resources["miss"]);
        this.gameOver = Sound.from(Loader.shared.resources["gameOver"]);

        new Keyboard();
        Keyboard.initialize();

        const touch = new TouchArea();
        this.addChild(touch);
    }

    public update(deltaTime: number): void {
        this.fruits.forEach(fruit => {
            fruit.updatePosition(deltaTime);

            if (fruit.getHeight() > Manager.height) {

                if (this.healthBar.isEmpty()) {
                    this.gameOver.play();

                    this.musicTheme.stop();

                    const resultScreen = new Result(this.score.getScore());
                    Manager.changeScene(resultScreen);
                }

                this.healthBar.removePoint();

                this.miss.play();
                fruit.respawn()
            }

            if (this.checkCollision(this.player, fruit, 60)) {

                if (this.powerBar.isFilled()) {
                    this.addFruit();
                    this.success.play();
                } else {
                    this.chime.play();
                }

                this.powerBar.addPoint();
                this.score.add();

                fruit.respawn();
            }
        });

    }

    private addFruit() {
        // if (this.fruits.length < this.maxFruitCount && this.score.minusScore === 0) {
        if (this.fruits.length < this.maxFruitCount) {
            const fruit = new Fruit();
            this.fruits.push(fruit);
            this.addChild(fruit);
        }
    }

    private checkCollision(objA: DisplayObject, objB: DisplayObject, offsetY: number): boolean {
        const a = objA.getBounds();
        const b = objB.getBounds();

        const rightmostLeft = a.left < b.left ? b.left : a.left;
        const leftmostRight = a.right > b.right ? b.right : a.right;

        if (leftmostRight <= rightmostLeft + offsetY) {
            return false;
        }

        const bottommostTop = a.top < b.top ? b.top : a.top;
        const topmostBottom = a.bottom > b.bottom ? b.bottom : a.bottom;

        return topmostBottom > bottommostTop;
    }
}