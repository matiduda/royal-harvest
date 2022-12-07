import { Container, Text, TextStyle } from "pixi.js";
import { Manager } from "../scenes/SceneManager";

export class Score extends Container {

    private text: Text;

    private score: number = 0;

    constructor() {
        super();

        const styly: TextStyle = new TextStyle({
            fontFamily: 'Courier New',
            fontSize: 55,
            fontWeight: 'bold',
            fill: 0x0F0F0F,
            align: 'center',
        });

        this.text = new Text('0', styly); // Text supports unicode!

        this.text.anchor.set(0.5);
        this.text.x = Manager.width / 2;
        this.text.y = Manager.height * 0.1;

        this.addChild(this.text);
    }

    public add() {
        this.text.text = String(++this.score);
    }

    public getScore() {
        return this.score;
    }
}