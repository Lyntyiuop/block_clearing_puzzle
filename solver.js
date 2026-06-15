// ============================================================
//  Block Clearing Solver — BFS with state dedup
//  Verifies the penguin puzzle is solvable and finds a solution.
//  Usage: node solver.js
// ============================================================

const ROWS = 10;
const COLS = 10;
const EMPTY = 0;
const YELLOW = 1;
const PINK = 2;
const DARK_BLUE = 3;
const BLACK = 4;

const DIRS = ['up', 'down', 'left', 'right'];
const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

// Shared level data (edit levels.js to change the puzzle)
const { PENGUIN_PATTERN } = require('./levels.js');

// Deep copy
function clone(board) {
  return board.map(r => [...r]);
}

// Slide + chain reaction — returns new board or null if no change
function applyMove(board, dir) {
  const b = clone(board);
  const moved = slide(b, dir);
  if (!moved) return null;

  // Chain reaction
  let anyElim = false;
  while (true) {
    const targets = findEliminations(b);
    if (targets.length === 0) break;
    anyElim = true;
    for (const { r, c } of targets) {
      b[r][c] = EMPTY;
    }
    slide(b, dir); // Fill gaps; result doesn't matter for continuation
  }

  return b;
}

function slide(board, dir) {
  let changed = false;

  if (dir === 'left') {
    for (let r = 0; r < ROWS; r++) {
      const blocks = [];
      for (let c = 0; c < COLS; c++) {
        if (board[r][c] !== EMPTY) blocks.push(board[r][c]);
      }
      for (let c = 0; c < COLS; c++) {
        const nv = c < blocks.length ? blocks[c] : EMPTY;
        if (board[r][c] !== nv) changed = true;
        board[r][c] = nv;
      }
    }
  } else if (dir === 'right') {
    for (let r = 0; r < ROWS; r++) {
      const blocks = [];
      for (let c = 0; c < COLS; c++) {
        if (board[r][c] !== EMPTY) blocks.push(board[r][c]);
      }
      for (let c = 0; c < COLS; c++) {
        const idx = c - (COLS - blocks.length);
        const nv = idx >= 0 ? blocks[idx] : EMPTY;
        if (board[r][c] !== nv) changed = true;
        board[r][c] = nv;
      }
    }
  } else if (dir === 'up') {
    for (let c = 0; c < COLS; c++) {
      const blocks = [];
      for (let r = 0; r < ROWS; r++) {
        if (board[r][c] !== EMPTY) blocks.push(board[r][c]);
      }
      for (let r = 0; r < ROWS; r++) {
        const nv = r < blocks.length ? blocks[r] : EMPTY;
        if (board[r][c] !== nv) changed = true;
        board[r][c] = nv;
      }
    }
  } else if (dir === 'down') {
    for (let c = 0; c < COLS; c++) {
      const blocks = [];
      for (let r = 0; r < ROWS; r++) {
        if (board[r][c] !== EMPTY) blocks.push(board[r][c]);
      }
      for (let r = 0; r < ROWS; r++) {
        const idx = r - (ROWS - blocks.length);
        const nv = idx >= 0 ? blocks[idx] : EMPTY;
        if (board[r][c] !== nv) changed = true;
        board[r][c] = nv;
      }
    }
  }

  return changed;
}

function findEliminations(board) {
  const targets = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const v = board[r][c];
      if (v === EMPTY) continue;
      if ((v === YELLOW && c === 0) ||
          (v === PINK && r === 0) ||
          (v === DARK_BLUE && c === COLS - 1) ||
          (v === BLACK && r === ROWS - 1)) {
        targets.push({ r, c });
      }
    }
  }
  return targets;
}

function isWin(board) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== EMPTY) return false;
    }
  }
  return true;
}

function encode(board) {
  let s = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      s += board[r][c].toString();
    }
  }
  return s;
}

function countBlocks(board) {
  let count = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== EMPTY) count++;
    }
  }
  return count;
}

// ============================================================
//  BFS Solver
// ============================================================
function solve(initial, maxDepth = 40) {
  const startKey = encode(initial);
  const visited = new Map(); // key -> {depth, parent, dir}
  visited.set(startKey, { depth: 0, parent: null, dir: null });

  const queue = [{ board: initial, key: startKey, depth: 0, lastDir: null }];
  let head = 0;

  let bestBlocks = countBlocks(initial);
  let bestDepth = 0;
  let nodesExplored = 0;
  const startTime = Date.now();

  while (head < queue.length) {
    const { board, key, depth, lastDir } = queue[head++];
    nodesExplored++;

    // Progress reporting
    if (nodesExplored % 100000 === 0) {
      const elapsed = (Date.now() - startTime) / 1000;
      console.log(`  explored ${nodesExplored} nodes, depth=${depth}, queue=${queue.length - head}, best=${bestBlocks} blocks left, ${elapsed.toFixed(1)}s`);
    }

    if (depth >= maxDepth) continue;
    if (depth > bestDepth) {
      bestDepth = depth;
    }

    for (const dir of DIRS) {
      // Prune: don't immediately reverse the last move
      if (lastDir && dir === OPPOSITE[lastDir]) continue;

      const next = applyMove(board, dir);
      if (next === null) continue; // No change

      const nextKey = encode(next);
      const blocksLeft = countBlocks(next);

      // Track best state
      if (blocksLeft < bestBlocks) {
        bestBlocks = blocksLeft;
        console.log(`  [new best] ${blocksLeft} blocks left at depth ${depth + 1}, dir=${dir}`);
      }

      // Check win
      if (isWin(next)) {
        // Reconstruct path: backtrack through visited entries
        const path = [dir];
        let entry = visited.get(key); // state BEFORE the winning move
        while (entry && entry.dir !== null && entry.parent) {
          path.unshift(entry.dir);
          entry = entry.parent;
        }
        const elapsed = (Date.now() - startTime) / 1000;
        console.log(`\n✅ SOLUTION FOUND after ${elapsed.toFixed(1)}s, ${nodesExplored} nodes`);
        console.log(`Path (${path.length} moves): ${path.join(' → ')}`);
        return path;
      }

      // Check if we've seen this state before at same or shallower depth
      const existing = visited.get(nextKey);
      if (existing && existing.depth <= depth + 1) continue;

      visited.set(nextKey, { depth: depth + 1, parent: visited.get(key), dir });
      queue.push({ board: next, key: nextKey, depth: depth + 1, lastDir: dir });
    }
  }

  const elapsed = (Date.now() - startTime) / 1000;
  console.log(`\n❌ No solution found within depth ${maxDepth}`);
  console.log(`   Explored ${nodesExplored} nodes in ${elapsed.toFixed(1)}s`);
  console.log(`   Best: ${bestBlocks} blocks remaining`);
  console.log(`   Visited ${visited.size} unique states`);
  return null;
}

// ============================================================
//  Run
// ============================================================
console.log('Block Clearing Solver');
console.log('====================');
console.log(`Initial blocks: ${countBlocks(PENGUIN_PATTERN)}`);
console.log('Starting BFS search (max depth 30)...\n');

const solution = solve(PENGUIN_PATTERN, 30);

if (solution) {
  console.log('\n--- Verifying solution ---');
  let board = clone(PENGUIN_PATTERN);
  console.log(`Start: ${countBlocks(board)} blocks`);
  for (let i = 0; i < solution.length; i++) {
    const next = applyMove(board, solution[i]);
    if (!next) {
      console.log(`  Move ${i + 1}: ${solution[i]} → NO CHANGE (unexpected)`);
      break;
    }
    board = next;
    const left = countBlocks(board);
    console.log(`  Move ${i + 1}: ${solution[i]} → ${left} blocks left`);
    if (left === 0) {
      console.log('  🎉 All cleared!');
      break;
    }
  }
}
