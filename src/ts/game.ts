import { Align, pushQuad, pushText } from "./draw";
import { SCREEN_CENTER_X, SCREEN_CENTER_Y, SCREEN_HEIGHT, SCREEN_WIDTH } from "./screen";
import { allColours, white } from "./palettte";
import { gl_clear, gl_flush, gl_getContext, gl_init, gl_setClear } from "./gl";
import { initStats, tickStats } from "./stats";

import { assert } from "./debug";
import { loadSpriteSheet } from "./texture";

function randomInt(min: number, max: number): number
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

  let delta: number;
  let then: number;
  function loop(now: number): void
  {
    delta = now - then;
    then = now;
    gl_clear();
    // for (let x = 0; x < SCREEN_WIDTH; x += 8)
    // {
    //   for (let y = 0; y < SCREEN_HEIGHT; y += 8)
    //   {
    //     let colour = allColours[randomInt(0, 9)];
    //     pushQuad(x, y, 8, 8, colour);
    //   }
    // }
    pushText(`LOSPEC JAM 2021`, SCREEN_CENTER_X, SCREEN_CENTER_Y - 12, { _textAlign: Align.Center });
    pushText(`Entry by David Brad`, SCREEN_CENTER_X, SCREEN_CENTER_Y - 4, { _textAlign: Align.Center });
    let i = 0;
    for (const colour of allColours)
    {
      pushQuad(20 + (i * 20), SCREEN_CENTER_Y + 8, 20, 20, colour);
      i++;
    }
    gl_flush();

    // @ifdef DEBUG
    tickStats(now, delta);
    // @endif

    requestAnimationFrame(loop);
  }
  gl_setClear(29, 28, 31);
  then = performance.now();
  requestAnimationFrame(loop);
});