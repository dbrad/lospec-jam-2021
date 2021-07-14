import { Easing, Interpolators, createInterpolationData } from "./interpolate";
import { gl_restore, gl_save, gl_translate } from "./gl";

import { v2 } from "./v2";

let nextNodeId = 0;
export const node_render_function: ((nodeId: number, now: number, delta: number) => void)[] = [];
export const node_position: v2[] = [];
export const node_z_index: number[] = [];
export const node_size: v2[] = [];
export const node_enabled: boolean[] = [];
export const node_visible: boolean[] = [];
export const node_interactive: boolean[] = [];
export const node_parent: number[] = [];
export const node_children: number[][] = [];


export function createNode(): number
{
  const nodeId = ++nextNodeId;

  node_position[nodeId] = [0, 0];
  node_z_index[nodeId] = 0;
  node_size[nodeId] = [1, 1];

  node_enabled[nodeId] = true;
  node_visible[nodeId] = true;
  node_interactive[nodeId] = true;

  node_parent[nodeId] = 0;
  node_children[nodeId] = [];

  return nodeId;
}

export function addChildNode(nodeId: number, childNodeId: number, zIndex: number = 0): void
{
  const oldParentId = node_parent[childNodeId];
  if (oldParentId > 0)
  {
    let index = 0;
    for (const searchId of node_children[oldParentId])
    {
      if (searchId === childNodeId)
      {
        node_children[oldParentId] = node_children[oldParentId].splice(index, 1);
        break;
      }
      index++;
    }
  }

  node_parent[childNodeId] = nodeId;

  node_children[nodeId].push(childNodeId);
  node_children[nodeId].sort((nodeIdA: number, nodeIdB: number) =>
  {
    return node_z_index[nodeIdA] - node_z_index[nodeIdB];
  });
}

export function moveNode(nodeId: number, pos: v2, ease: Easing = Easing.None, duration: number = 0): Promise<void>
{
  if (node_position[nodeId][0] === pos[0] && node_position[nodeId][1] === pos[1])
  {
    return Promise.resolve();
  }
  const interpKey = `node-movement-${ nodeId }`;
  if (ease !== Easing.None && !Interpolators.has(interpKey) && duration > 0)
  {
    return new Promise((resolve, _) =>
    {
      Interpolators.set(interpKey, createInterpolationData(duration, node_position[nodeId], pos, ease, resolve));
    });
  }
  node_position[nodeId][0] = pos[0];
  node_position[nodeId][1] = pos[1];
  return Promise.resolve();
}

export function renderNode(nodeId: number, now: number, delta: number): void
{
  if (node_enabled[nodeId] && node_visible[nodeId])
  {
    const position = node_position[nodeId];
    gl_save();
    gl_translate(position[0], position[1]);

    if (node_render_function[nodeId])
    {
      node_render_function[nodeId](nodeId, now, delta);
    }

    for (const childId of node_children[nodeId])
    {
      renderNode(childId, now, delta);
    }
    gl_restore();
  }
}