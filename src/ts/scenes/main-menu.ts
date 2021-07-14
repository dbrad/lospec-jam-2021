import { Align, createTextNode } from "../nodes/text-node";
import { SCREEN_CENTER_X, SCREEN_HEIGHT, SCREEN_WIDTH } from "../screen";
import { addChildNode, createNode, moveNode, node_size } from "../scene-node";

import { createAnimatedSpriteNode } from "../nodes/sprite-node";
import { createInfiniteScrollNode } from "../nodes/infinite-scroll-node";

let devilWalkId: number;

let groundSpeed = 33;
let treeSpeed = (groundSpeed * 8);
let mountainSpeed = (treeSpeed * 3);
let skySpeed = (mountainSpeed * 3);
export function setupMainMenu(): number
{
  const rootId = createNode();
  node_size[rootId] = [SCREEN_WIDTH, SCREEN_HEIGHT];

  const textNodeId = createTextNode("Lospec Jam 2021", SCREEN_WIDTH, { textAlign: Align.Center });
  moveNode(textNodeId, [SCREEN_CENTER_X, 20]);
  addChildNode(rootId, textNodeId);

  const textNodeId02 = createTextNode("Entry by David Brad", SCREEN_WIDTH, { textAlign: Align.Center });
  moveNode(textNodeId02, [SCREEN_CENTER_X, 30]);
  addChildNode(rootId, textNodeId02);

  let skyLineScrollId = createInfiniteScrollNode(["skyline_01", "skyline_02", "skyline_03", "skyline_04", "skyline_05"], 240, skySpeed);
  moveNode(skyLineScrollId, [0, 71]);
  addChildNode(rootId, skyLineScrollId);

  let mountainScrollId = createInfiniteScrollNode(["mountain_a_01", "mountain_a_02", "mountain_a_03", "mountain_a_04", "mountain_b_01", "mountain_b_02", "mountain_b_03"], 240, mountainSpeed);
  moveNode(mountainScrollId, [0, 87]);
  addChildNode(rootId, mountainScrollId);

  let forestScrollId = createInfiniteScrollNode(["forest_01", "forest_02", "forest_03"], 240, treeSpeed);
  moveNode(forestScrollId, [0, 103]);
  addChildNode(rootId, forestScrollId);

  devilWalkId = createAnimatedSpriteNode(
    [["devil_walk_01", 80], ["devil_walk_02", 80], ["devil_walk_03", 80], ["devil_walk_04", 80], ["devil_walk_05", 80], ["devil_walk_06", 80], ["devil_walk_07", 80], ["devil_walk_08", 80], ["devil_walk_09", 80], ["devil_walk_10", 80], ["devil_walk_11", 83], ["devil_walk_12", 83]]);
  moveNode(devilWalkId, [32, 103]);
  addChildNode(rootId, devilWalkId);

  let groundScrollid = createInfiniteScrollNode(["ground_01", "ground_02", "ground_03"], 240, groundSpeed);
  moveNode(groundScrollid, [0, 119]);
  addChildNode(rootId, groundScrollid);

  return rootId;
}

export function updateMainMenu(now: number, delta: number): void
{

}