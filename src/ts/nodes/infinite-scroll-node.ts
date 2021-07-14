import { Texture, getTexture } from "../texture";
import { createNode, node_render_function, node_size } from "../scene-node";

import { gl_pushTextureQuad } from "../gl";

const node_inf_tiles: Texture[][] = [];
const node_inf_width: number[] = [];
const node_inf_speed: number[] = [];

const node_inf_tile_index: number[] = [];
const node_inf_active: boolean[] = [];
const node_inf_timer: number[] = [];
const node_inf_x_offset: number[] = [];

export function createInfiniteScrollNode(textures: string[], width: number, speed: number): number 
{
  const nodeId = createNode();
  node_render_function[nodeId] = renderInfiniteScrollNode;

  node_inf_tiles[nodeId] = [];
  for (const texture of textures)
  {
    node_inf_tiles[nodeId].push(getTexture(texture));
  }
  node_inf_speed[nodeId] = speed;
  node_inf_width[nodeId] = width;
  node_size[nodeId][0] = width;

  node_inf_timer[nodeId] = 0;
  node_inf_tile_index[nodeId] = 0;
  node_inf_x_offset[nodeId] = 0;
  node_inf_active[nodeId] = true;

  return nodeId;
}

function renderInfiniteScrollNode(nodeId: number, now: number, delta: number): void 
{
  node_inf_timer[nodeId] += delta;
  if (node_inf_timer[nodeId] >= node_inf_speed[nodeId])
  {
    node_inf_timer[nodeId] -= node_inf_speed[nodeId];
    node_inf_x_offset[nodeId] += 1;
    if (node_inf_x_offset[nodeId] > 16)
    {
      node_inf_x_offset[nodeId] = 0;
      node_inf_tile_index[nodeId] = (node_inf_tile_index[nodeId] + 1) % node_inf_tiles[nodeId].length;
    }
  }
  const textures = node_inf_tiles[nodeId];
  const width = node_inf_width[nodeId];
  let index = 0;
  let tile_index = node_inf_tile_index[nodeId];
  let x = 0;
  do
  {
    x = (index * 16) - node_inf_x_offset[nodeId];
    let t = textures[tile_index];
    gl_pushTextureQuad(t._atlas, x, 0, t._w, t._h, t._u0, t._v0, t._u1, t._v1);
    index++;
    tile_index = (tile_index + 1) % node_inf_tiles[nodeId].length;
  } while (x <= width);
}