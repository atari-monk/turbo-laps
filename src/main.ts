import "./style.css";
import "fullscreen-canvas-vanilla";
import { createGameCanvas } from "fullscreen-canvas-vanilla";
import { GameEngine, GameEngineFactory } from "zippy-game-engine";
import { RectangleTrack } from "./scenes/rectangle-track";
import { ArrowPlayer } from "./scenes/arrow-player";
import { StartingGrid } from "./scenes/starting-grid";
import { TrackBoundary } from "./scenes/track-boundary";
import { RoadMarkings } from "./scenes/road-markings";
import { TrackGrass } from "./scenes/track-grass";
import { LapTracker } from "./scenes/lap-tracker";
import { GameScore } from "./scenes/game-score";
import { Menu } from "./scenes/menu";
import { getCanvasSizeById } from "./tools";

let SCENE_MODE: "all" | "current" = "current";
const TEST_SCENE_INDEX = 0;
const ALL_SCENES = [
    "Menu",
    "Rectangle Track",
    "Arrow Player",
    "Starting Grid",
    "Track Boundary",
    "Road Markings",
    "Track Grass",
    "Lap Tracker",
    "Game Score",
];

let gameEngine: GameEngine;

window.addEventListener("load", async () => {
    gameEngine = setupEngine();
    createGameCanvas("canvas-container", "game-canvas", gameEngine);
    const { canvas } = getCanvasSizeById("game-canvas");
    gameEngine.input.setupCanvasEvents(canvas);

    gameEngine.setSceneMode(SCENE_MODE);
    registerScenes(gameEngine, canvas);

    if ((SCENE_MODE as string) === "current") {
        if (TEST_SCENE_INDEX >= 0 && TEST_SCENE_INDEX < ALL_SCENES.length) {
            gameEngine.transitionToScene(ALL_SCENES[TEST_SCENE_INDEX]);
        } else {
            console.warn(
                `Invalid test scene index: ${TEST_SCENE_INDEX}. Available scenes: ${ALL_SCENES.length}`
            );
        }
    }
});

function registerScenesForCurrentMode(gameEngine: GameEngine) {
    const menu = new Menu(gameEngine.input);

    menu.setOnStartGame(() => {
        SCENE_MODE = "all";
        gameEngine.setSceneMode(SCENE_MODE);
    });

    gameEngine.registerScene("Menu", menu);
}

function registerScenesForAllMode(
    gameEngine: GameEngine,
    canvas: HTMLCanvasElement
) {
    const track = new RectangleTrack(canvas);
    const arrowPlayer = new ArrowPlayer(canvas, gameEngine.input);
    const trackBoundary = new TrackBoundary(track);
    const startingGrid = new StartingGrid(track);
    const roadMarkings = new RoadMarkings(track);
    const trackGrass = new TrackGrass(track);
    const lapTracker = new LapTracker(track, arrowPlayer);
    const gameScore = new GameScore(lapTracker);

    arrowPlayer.setTrackBoundary(trackBoundary);
    arrowPlayer.setStartingPosition(startingGrid.getStartingPosition());

    gameEngine.registerScene("Rectangle Track", track);
    gameEngine.registerScene("Track Boundary", trackBoundary);
    gameEngine.registerScene("Starting Grid", startingGrid);
    gameEngine.registerScene("Road Markings", roadMarkings);
    gameEngine.registerScene("Track Grass", trackGrass);
    gameEngine.registerScene("Arrow Player", arrowPlayer);
    gameEngine.registerScene("Lap Tracker", lapTracker);
    gameEngine.registerScene("Game Score", gameScore);
}

function registerScenes(gameEngine: GameEngine, canvas: HTMLCanvasElement) {
    registerScenesForCurrentMode(gameEngine);
    registerScenesForAllMode(gameEngine, canvas);
}

function setupEngine() {
    const gameEngineFactory = new GameEngineFactory();
    const gameEngine = gameEngineFactory.getGameEngine();
    return gameEngine;
}
