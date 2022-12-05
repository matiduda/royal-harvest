import { Container } from "pixi.js";
import { Player } from "./Player"
import { Fruit } from "./Fruit"
import { Score } from "./Score"

export class Scene extends Container {

    private readonly screenWidth: number;
    private readonly screenHeight: number;

    private player: Player;
    private fruit: Fruit;

    private score: Score;

    constructor(screenWidth: number, screenHeight: number) {
        super();

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;


        this.player = new Player(this.screenWidth, this.screenHeight);
        this.addChild(this.player);

        this.fruit = new Fruit(this.screenWidth, this.screenHeight);
        this.addChild(this.fruit);

        this.score = new Score(this.player, this.fruit);
        this.addChild(this.score);
    }
}