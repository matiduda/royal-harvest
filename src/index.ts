import { Manager } from './scenes/Manager'; // This is the import statement
import { Scene } from './scenes/Scene'; // This is the import statement

const APP_WIDTH: number = 1080;
const APP_HEIGHT: number = 1080;

Manager.initialize(APP_WIDTH, APP_HEIGHT, 0xFFFFFF);

const Game = new Scene(Manager.width, Manager.height);

Manager.changeScene(Game);