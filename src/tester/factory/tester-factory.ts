import { CarFactory } from "../../car/car-factory";
import { componentsFactory } from "./components-factory";
import { mobileGameFactory } from "./mobile-game-factory";

export async function testerFactory(): Promise<void> {
    const { gameEngine, canvas, sceneInstanceFactory } = componentsFactory();

    const carFactory = new CarFactory(gameEngine, canvas);

    await mobileGameFactory(sceneInstanceFactory, carFactory, gameEngine);
}
