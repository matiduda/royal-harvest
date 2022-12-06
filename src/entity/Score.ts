import { Container, Sprite, SCALE_MODES, Graphics } from "pixi.js";
import { Manager } from "../scenes/SceneManager";

export class Score extends Container {

    private progressBar: Container;
    private progressBarBoder: Sprite;

    private minusBarFill: Graphics;
    private plusBarFill: Graphics;

    private readonly plusColor: number = 0xfeae34;
    private readonly minusColor: number = 0x8b9bb4;

    private readonly barScale = 6;

    public plusScore: number;
    public minusScore: number;

    private readonly maxScore: number = 8;

    constructor() {
        super();

        this.progressBarBoder = Sprite.from('bar');
        this.progressBarBoder.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST

        this.progressBarBoder.scale.x = this.barScale;
        this.progressBarBoder.scale.y = this.barScale;

        const pw = this.progressBarBoder.width;
        const ph = this.progressBarBoder.height;

        this.plusBarFill = new Graphics();
        this.plusBarFill.beginFill(this.plusColor, 1)
        this.plusBarFill.drawRect(0, 0, pw * 0.47, ph * 0.455);
        this.plusBarFill.endFill();

        this.plusBarFill.x = pw * 0.525;
        this.plusBarFill.y = ph * 0.27;
        this.plusBarFill.scale.x = 0;

        this.minusBarFill = new Graphics();
        this.minusBarFill.beginFill(this.minusColor, 1)
        this.minusBarFill.drawRect(0, 0, pw * 0.47, ph * 0.455);
        this.minusBarFill.endFill();

        this.minusBarFill.x = pw * 0.477;
        this.minusBarFill.y = ph * 0.27
        this.minusBarFill.scale.x = 0;

        this.progressBar = new Container();
        this.progressBar.addChild(this.plusBarFill);
        this.progressBar.addChild(this.minusBarFill);
        this.progressBar.addChild(this.progressBarBoder);
        this.progressBar.x = (Manager.width - this.progressBar.width) / 2;
        this.progressBar.y = 60;
        this.addChild(this.progressBar);

        this.plusScore = 0;
        this.minusScore = 0;
    }

    public levelUp() {
        return this.plusScore === this.maxScore;
    }

    public addPoint() {
        if (this.plusScore < this.maxScore) {
            this.plusScore++;
        } else {
            this.plusScore = 0;

            if (this.minusScore > 0) {
                this.minusScore--;
                this.updateMinusBar();
            }
        }

        this.updatePlusBar();
    }

    public removePoint() {
        if (this.minusScore < this.maxScore) {
            this.minusScore++;
        } else {
            this.minusScore = 0;
        }

        this.updateMinusBar();
    }

    private updatePlusBar() {
        this.plusBarFill.scale.x = this.plusScore * 0.125;
    }

    private updateMinusBar() {
        this.minusBarFill.scale.x = this.minusScore * -0.125;
    }
}