import { Container, DisplayObject, Loader } from "pixi.js";
import { Sound } from "@pixi/sound";
import { SceneInterface } from "./SceneInterface";
import { Fruit } from "../entity/Fruit";
import { Player } from "../entity/Player";
import { Score } from "../entity/Score";
import { Manager } from "./SceneManager";

export class Game extends Container implements SceneInterface {

    private player: Player;
    private score: Score;

    private fruits: Fruit[] = new Array<Fruit>();

    private musicTheme: Sound;
    private chime: Sound;
    private success: Sound;
    private miss: Sound;

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

        this.addFruit();

        this.chime = Sound.from(Loader.shared.resources["chime"]);
        this.success = Sound.from(Loader.shared.resources["success"]);
        this.miss = Sound.from(Loader.shared.resources["miss"]);
    }

    public update(deltaTime: number): void {

        this.fruits.forEach(fruit => {

            fruit.updatePosition(deltaTime);

            if (fruit.getHeight() > Manager.height) {
                // Update score
                this.score.removePoint();
                this.miss.play();
                fruit.respawn()
            }

            if (this.checkCollision(this.player, fruit, 60)) {

                if (this.score.levelUp()) {
                    this.addFruit();
                    this.success.play();
                } else {
                    this.chime.play();
                }

                this.score.addPoint();
                fruit.respawn();
            }
        });

    }

    private addFruit() {
        if (this.fruits.length < this.maxFruitCount && this.score.minusScore === 0) {
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