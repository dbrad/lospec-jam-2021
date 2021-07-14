import { assert } from "./debug";
import { renderNode } from "./scene-node";

type Scene =
  {
    rootId: number,
    updateFn: (now: number, delta: number) => void;
  };
const Scenes: Map<string, Scene> = new Map();
const SceneStack: Scene[] = [];
let CurrentScene: Scene;
export function registerScene(name: string, setupFn: () => number, updateFn: (now: number, delta: number) => void): void
{
  const rootId = setupFn();
  Scenes.set(name, { rootId, updateFn });
}

export function pushScene(name: string): void
{
  const scene = Scenes.get(name);
  assert(scene !== undefined, `Unable to find scene "${ name }"`);
  SceneStack.push(scene);
  CurrentScene = scene;
}

export function popScene(): void
{
  SceneStack.pop();
  CurrentScene = SceneStack[SceneStack.length - 1];
}

export function updateScene(now: number, delta: number): void
{
  CurrentScene.updateFn(now, delta);
}

export function renderScene(now: number, delta: number): void
{
  const rootId = CurrentScene.rootId;
  renderNode(rootId, now, delta);
}