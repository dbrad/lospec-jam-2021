import { gl_pushTextureQuad, gl_restore, gl_save, gl_translate } from "./gl";

import { getTexture } from "./texture";

export function pushSprite(textureName: string, x: number, y: number, colour: number = 0xFFFFFFFF, sx: number = 1, sy: number = 1): void
{
  const t = getTexture(textureName);
  gl_translate(x, y);
  gl_pushTextureQuad(t._atlas, 0, 0, t._w * sx, t._h * sy, t._u0, t._v0, t._u1, t._v1, colour);
}

export function pushSpriteAndSave(textureName: string, x: number, y: number, colour: number = 0xFFFFFFFF, sx: number = 1, sy: number = 1): void
{
  gl_save();
  pushSprite(textureName, x, y, colour, sx, sy);
  gl_restore();
}

export function pushQuad(x: number, y: number, w: number, h: number, colour: number = 0xFFFFFFFF): void
{
  const t = getTexture("quad");
  gl_save();
  gl_translate(x, y);
  gl_pushTextureQuad(t._atlas, 0, 0, w, h, t._u0, t._v0, t._u1, t._v1, colour);
  gl_restore();
}