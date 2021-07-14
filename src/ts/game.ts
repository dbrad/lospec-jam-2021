import { Interpolators, interpolate } from "./interpolate";
import { SCREEN_CENTER_Y, SCREEN_HEIGHT, SCREEN_WIDTH } from "./screen";
import { allColours, black, darkred } from "./palettte";
import { gl_clear, gl_flush, gl_getContext, gl_init, gl_setClear } from "./gl";
import { initStats, tickStats } from "./stats";
import { pushScene, registerScene, renderScene, updateScene } from "./scene";
import { setupMainMenu, updateMainMenu } from "./scenes/main-menu";

import { assert } from "./debug";
import { loadSpriteSheet } from "./texture";
import { pushQuad } from "./draw";

window.addEventListener("load", async () =>
{
  const canvas = document.querySelector(`canvas`);
  assert(canvas !== null, `Unable to find canvas element on index.html`);
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  let context = gl_getContext(canvas);
  gl_init(context);
  await loadSpriteSheet();
  initStats();

  registerScene(`MainMenu`, setupMainMenu, updateMainMenu);

  let delta: number;
  let then: number;
  function loop(now: number): void
  {
    delta = now - then;
    then = now;
    gl_clear();
    let i = 0;
    // for (const colour of allColours)
    // {
    //   pushQuad(20 + (i * 20), SCREEN_CENTER_Y + 8, 20, 20, colour);
    //   i++;
    // }
    pushQuad(0, SCREEN_HEIGHT - 64, SCREEN_WIDTH, 32, darkred);
    pushQuad(0, SCREEN_HEIGHT - 32, SCREEN_WIDTH, 32, black);

    for (const [_, interpolator] of Interpolators)
    {
      interpolate(now, interpolator);
    }

    updateScene(now, delta);
    renderScene(now, delta);
    gl_flush();

    // @ifdef DEBUG
    tickStats(now, delta);
    // @endif

    requestAnimationFrame(loop);
  }
  gl_setClear(29, 28, 31);
  pushScene("MainMenu");
  then = performance.now();
  requestAnimationFrame(loop);
});