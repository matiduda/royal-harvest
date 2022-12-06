import { Manager } from './scenes/SceneManager';
import { Loading } from './scenes/Loading';

const _APP_WIDTH: number = 1080;
const _APP_HEIGHT: number = 1080;
const _APP_BACKGROND: number = 0xFFFFFF;

Manager.initialize(_APP_WIDTH, _APP_HEIGHT, _APP_BACKGROND);

const loadingScreen: Loading = new Loading();
Manager.changeScene(loadingScreen);