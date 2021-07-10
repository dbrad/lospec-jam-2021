import { gl_pushTextureQuad, gl_restore, gl_save, gl_scale, gl_translate } from "./gl";

import { TEXTURE_CACHE } from "./texture";
import { assert } from "./debug";
import { white } from "./palettte";

export function pushSprite(textureName: string, x: number, y: number, colour: number = 0xFFFFFFFF, sx: number = 1, sy: number = 1): void
{
  const t = TEXTURE_CACHE.get(textureName);
  assert(t !== undefined, `No such texture as ${ textureName }`);
  gl_pushTextureQuad(t._atlas, 0, 0, t._w * sx, t._h * sy, t._u0, t._v0, t._u1, t._v1, colour);
}

export function pushSpriteAndSave(textureName: string, x: number, y: number, colour: number = 0xFFFFFFFF, sx: number = 1, sy: number = 1): void
{
  gl_save();
  gl_translate(x, y);
  pushSprite(textureName, 0, 0, colour, sx, sy);
  gl_restore();
}

export function pushQuad(x: number, y: number, w: number, h: number, colour: number = 0xFFFFFFFF): void
{
  const t = TEXTURE_CACHE.get("quad");
  assert(t !== undefined, `No such texture as flat`);
  gl_save();
  gl_translate(x, y);
  gl_pushTextureQuad(t._atlas, 0, 0, w, h, t._u0, t._v0, t._u1, t._v1, colour);
  gl_restore();
}

export const enum Align
{
  Left,
  Center,
  Right
}

export type TextParams = {
  _colour?: number,
  _textAlign?: Align,
  _scale?: number,
  _wrap?: number;
};

const textCache: Map<string, string[]> = new Map();
const fontSize: number = 8;

export function parseText(text: string, params: TextParams = {}): number
{
  params._scale = params._scale || 1;
  params._wrap = params._wrap || 0;
  const letterSize: number = fontSize * params._scale;
  const allWords: string[] = text.split(" ");

  let lines = textCache.get(`${ text }_${ params._scale }_${ params._wrap }`) || [];

  if (lines.length === 0)
  {
    if (params._wrap === 0)
    {
      lines = [allWords.join(" ")];
    }
    else
    {
      let line: string[] = [];
      for (const word of allWords)
      {
        line.push(word);
        if (line.join(" ").length * letterSize >= params._wrap)
        {
          const lastWord = line.pop();
          // @ifdef DEBUG
          if (!lastWord) throw `No last word to pop found.`;
          // @endif
          lines.push(line.join(" "));
          line = [lastWord];
        }
      }
      if (line.length > 0)
      {
        lines.push(line.join(" "));
      }
    }
    textCache.set(`${ text }_${ params._scale }_${ params._wrap }`, lines);
  }
  return lines.length;
}

export function pushText(text: string, x: number, y: number, params: TextParams = {}): number
{
  text = text.trimEnd();
  params._colour = params._colour || white;
  params._textAlign = params._textAlign || Align.Left;
  params._scale = params._scale || 1;
  params._wrap = params._wrap || 0;
  const letterSize: number = fontSize * params._scale;

  const orgx: number = x;
  let offx: number = 0;

  parseText(text, params);
  const lines = textCache.get(`${ text }_${ params._scale }_${ params._wrap }`);
  assert(lines !== undefined, `text lines not found`);

  for (const line of lines)
  {
    const words: string[] = line.split(" ");
    const lineLength: number = line.length * letterSize;

    let alignmentOffset: number = 0;
    if (params._textAlign === Align.Center)
    {
      alignmentOffset = ~~((-lineLength + (1 * params._scale)) / 2);
    }
    else if (params._textAlign === Align.Right)
    {
      alignmentOffset = ~~-(lineLength - (1 * params._scale));
    }

    for (const word of words)
    {
      for (const letter of word.split(""))
      {
        const t = TEXTURE_CACHE.get(letter);
        assert(t !== undefined, `No such texture as ${ letter }`);

        x = orgx + offx + alignmentOffset;

        gl_save();
        gl_translate(x, y);
        gl_scale(params._scale, params._scale);
        gl_pushTextureQuad(t._atlas, 0, 0, t._w, t._h, t._u0, t._v0, t._u1, t._v1, params._colour);
        gl_restore();
        offx += letterSize;
      }
      offx += letterSize;
    }
    y += letterSize * 2;
    offx = 0;
  }
  return lines.length;
}