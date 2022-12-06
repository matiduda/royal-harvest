import { DisplayObject } from "pixi.js";

export interface SceneInterface extends DisplayObject {
    update(framesPassed: number): void;
}