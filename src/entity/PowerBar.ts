import { Container, Sprite, Graphics } from "pixi.js";
import { Manager } from "../scenes/SceneManager";

export class PowerBar extends Container {

    private bar: Container;
    private border: Sprite;
    private fill: Graphics;

    private readonly fillColor: number = 0xccc429;

    private readonly barScale = 4.5;

    public points: number;
    private readonly maxPoints: number = 10;

    constructor() {
        super();

        this.border = Sprite.from('powerBar');

        this.border.scale.x = this.barScale;
        this.border.scale.y = this.barScale;

        const pw = this.border.width;
        const ph = this.border.height;

        this.fill = new Graphics();
        this.fill.beginFill(this.fillColor, 1)
        this.fill.drawRect(0, 0, pw * 0.89, ph * 0.313);
        this.fill.endFill();

        this.fill.x = pw * 0.11;
        this.fill.y = ph * 0.31;
        this.fill.scale.x = 0;

        this.bar = new Container();
        this.bar.addChild(this.fill);
        this.bar.addChild(this.border);
        this.bar.x = Manager.width - this.bar.width * 1.16;
        this.bar.y = Manager.height * 0.042;
        this.addChild(this.bar);

        this.points = 0;
    }

    public isFilled() {
        return this.points === this.maxPoints;
    }

    public addPoint() {
        if (this.points < this.maxPoints) {
            this.points++;
        } else {
            this.points = 0;
        }

        this.updateBar();
    }

    public removePoint() {
        if (this.points > 0) {
            this.points--;
        } else {
            // TODO: Game over
            this.points = 0;
        }

        this.updateBar();
    }

    private updateBar() {
        this.fill.scale.x = this.points / this.maxPoints;
    }
}