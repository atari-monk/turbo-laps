import "./style.css";
import "fullscreen-canvas-vanilla";
import { createGameCanvas } from "fullscreen-canvas-vanilla";
import { getCanvasSizeById, setupEngine } from "./tools";
import { SceneInstanceFactory } from "./factory/scene-instance-factory";
import { buildMenu } from "./builder/menu-builder";
import { GameType } from "./type/game-type";

window.addEventListener("load", async () => {
    try {
        const gameEngine = setupEngine();

        createGameCanvas("canvas-container", "game-canvas", gameEngine);
        const { canvas } = getCanvasSizeById("game-canvas");

        gameEngine.input.setupCanvasEvents(canvas);
        gameEngine.setSceneMode("current");

        const instanceFactory = new SceneInstanceFactory(gameEngine, canvas);

        const menu = buildMenu(
            instanceFactory,
            gameEngine,
            GameType.TURBO_LAPS_MOBILE
        );
        gameEngine.registerScene(menu.name!, menu);
        gameEngine.transitionToScene(menu.name!);
    } catch (error) {
        console.error("Failed to initialize:", error);
    }
});
