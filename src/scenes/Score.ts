import { Container, Ticker, TextStyle, Text, DisplayObject } from "pixi.js";
import { Player } from "./Player"
import { Fruit } from "./Fruit"
import { Sound } from "@pixi/sound";

export class Score extends Container {

    private player: Player;
    private fruit: Fruit;

    private scoreText: Text;
    private score: number;

    private chime: Sound;

    constructor(player: Player, fruit: Fruit) {
        super();

        this.fruit = fruit;
        this.player = player;

        const styly: TextStyle = new TextStyle({
            align: "center",
            fill: "#754c24",
            fontSize: 42
        });

        this.scoreText = new Text('Your score: 0', styly); // Text supports unicode!
        this.score = 0;
        this.addChild(this.scoreText);
        Ticker.shared.add(this.update, this);

        this.chime = Sound.from("chime.mp3");
        this.chime.volume = 1;
    }

    private update(): void {

        if (this.checkCollision(this.player, this.fruit)) {
            this.score += 1;
            this.scoreText.text = 'Your score: ' + this.score;

            this.chime.play();

            this.fruit.respawn();
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