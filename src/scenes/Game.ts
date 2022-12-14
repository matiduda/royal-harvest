import { Container, DisplayObject, Loader, Sprite } from "pixi.js";
import { Sound } from "@pixi/sound";
import { SceneInterface } from "./SceneInterface";
import { Food } from "../entity/Food";
import { Player } from "../entity/Player";
import { Manager } from "./SceneManager";
import { HealthBar } from "../entity/HealthBar";
import { PowerBar } from "../entity/PowerBar";
import { Score } from "../entity/Score";
import { Result } from "./Result";
import { Keyboard } from "../helper/Keyboard";
import { TouchArea } from "../helper/TouchArea";
import { Clouds } from "../entity/Clouds";

export class Game extends Container implements SceneInterface {

    private readonly maxFruitCount = 6;
    private fruits: Food[] = new Array<Food>();

    private player: Player;

    private score: Score;
    private healthBar: HealthBar;
    private powerBar: PowerBar;

    private background: Sprite;
    private grass: Sprite;
    private clouds: Clouds;

    private musicTheme: Sound;
    private chime: Sound;
    private success: Sound;
    private miss: Sound;
    private gameOver: Sound;

    constructor() {
        super();

        this.background = Sprite.from('background');
        this.grass = Sprite.from('grass');

        this.background.scale.x = 3.38;
        this.background.scale.y = 3.38;

        this.grass.scale.x = 3.38;
        this.grass.scale.y = 3.38;

        this.addChild(this.background);

        this.musicTheme = Sound.from(Loader.shared.resources["theme"]);
        this.musicTheme.volume = 0.2;
        this.musicTheme.loop = true;
        this.musicTheme.play();

        this.player = new Player();
        this.addChild(this.player);
        this.addChild(this.grass);

        this.clouds = new Clouds(7, 1, 0.4);
        this.addChild(this.clouds);

        this.addFruit();

        this.score = new Score();
        this.addChild(this.score);

        this.healthBar = new HealthBar();
        this.addChild(this.healthBar);

        this.powerBar = new PowerBar();
        this.addChild(this.powerBar);

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
        this.clouds.updatePosition();

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

            if (this.checkCollision(this.player.hitbox, fruit)) {

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

    private addFruit(): void {
        if (this.fruits.length < this.maxFruitCount) {
            const fruit = new Food();
            this.fruits.push(fruit);
            this.addChild(fruit);
        }
    }

    private checkCollision(objA: DisplayObject, objB: DisplayObject): boolean {
        const a = objA.getBounds();
        const b = objB.getBounds();

        const rightmostLeft = a.left < b.left ? b.left : a.left;
        const leftmostRight = a.right > b.right ? b.right : a.right;

        if (leftmostRight <= rightmostLeft) {
            return false;
        }

        const bottommostTop = a.top < b.top ? b.top : a.top;
        const topmostBottom = a.bottom > b.bottom ? b.bottom : a.bottom;

        return topmostBottom > bottommostTop;
    }
}