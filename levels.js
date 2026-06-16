// ============================================================
//  Shared Level Data — loaded by both index.html and solver.js
//  Edit patterns here; both files pick up changes automatically.
// ============================================================
//
//  Color legend:
//    0 = EMPTY
//    1 = YELLOW     (matches LEFT border,   col 0)
//    2 = PINK       (matches TOP border,    row 0)
//    3 = DARK_BLUE  (matches RIGHT border,  col 9)
//    4 = BLACK      (matches BOTTOM border, row 9)
//
//  Rules:
//    - No block may initially touch its matching border
//    - Must have empty cells as buffer for sliding
//    - Verify solvability with:  node solver.js
// ============================================================

// ── Level 1: Penguin (企鹅) ──────────────────────────────────
//     0 1 2 3 4 5 6 7 8 9
//  0: . . . . . . . . . .
//  1: . . . . . . . . . .
//  2: . . . B B B B . . .
//  3: . . B Y P P Y B . .
//  4: . . B B P P B B . .
//  5: . . B B D D B B . .
//  6: . . B D D D D B . .
//  7: . . . B B B B . . .
//  8: . . . . Y Y . . . .
//  9: . . . . . . . . . .
var PENGUIN_PATTERN = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,4,4,4,4,0,0,0],
  [0,0,4,1,2,2,1,4,0,0],
  [0,0,4,4,2,2,4,4,0,0],
  [0,0,4,4,3,3,4,4,0,0],
  [0,0,4,3,3,3,3,4,0,0],
  [0,0,0,4,4,4,4,0,0,0],
  [0,0,0,0,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
];

// ── Level 2: Cat (小猫) ──────────────────────────────────────
//     0 1 2 3 4 5 6 7 8 9
//  0: . . . . . . . . . .
//  1: . . 4 . . . . 4 . .    ears (black)
//  2: . 4 2 4 4 4 4 2 4 .    head outline + pink inside
//  3: . 4 2 2 2 2 2 2 4 .    face (pink)
//  4: . 4 2 1 2 2 1 2 4 .    eyes (yellow)
//  5: . 4 2 2 2 2 2 2 4 .    face (pink)
//  6: . . 4 2 2 2 2 4 . .    chin
//  7: . . . 4 3 3 4 . . .    body (dark blue + black sides)
//  8: . . . . 3 3 . . . .    paws (dark blue)
//  9: . . . . . . . . . .
var CAT_PATTERN = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,4,0,0,0,0,4,0,0],
  [0,4,2,4,4,4,4,2,4,0],
  [0,4,2,2,2,2,2,2,4,0],
  [0,4,2,1,2,2,1,2,4,0],
  [0,4,2,2,2,2,2,2,4,0],
  [0,0,4,2,2,2,2,4,0,0],
  [0,0,0,4,3,3,4,0,0,0],
  [0,0,0,0,3,3,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
];

// ── Level 3: Dog (小狗) ──────────────────────────────────────
//     0 1 2 3 4 5 6 7 8 9
//  0: . . . . . . . . . .
//  1: . 4 . . . . . . 4 .    ears (black, perky)
//  2: . 4 2 4 4 4 4 2 4 .    head outline (pink inner ears)
//  3: . . 4 2 2 2 2 4 . .    face (pink)
//  4: . . 4 1 2 2 1 4 . .    eyes (yellow)
//  5: . . 4 2 3 3 2 4 . .    nose (dark blue)
//  6: . . . 4 2 2 4 . . .    chin
//  7: . . . . 4 4 . . . .    body (black)
//  8: . . . . 3 3 . . . .    paws (dark blue)
//  9: . . . . . . . . . .
var DOG_PATTERN = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,4,0,0,0,0,0,0,4,0],
  [0,4,2,4,4,4,4,2,4,0],
  [0,0,4,2,2,2,2,4,0,0],
  [0,0,4,1,2,2,1,4,0,0],
  [0,0,4,2,3,3,2,4,0,0],
  [0,0,0,4,2,2,4,0,0,0],
  [0,0,0,0,4,4,0,0,0,0],
  [0,0,0,0,3,3,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
];

// ── Level 4: Cow (小牛) ──────────────────────────────────────
//     0 1 2 3 4 5 6 7 8 9
//  0: . . . . . . . . . .
//  1: . . 1 . . . . 1 . .    horns (yellow)
//  2: . 4 4 4 4 4 4 4 4 .    head top (black, wide)
//  3: . 4 2 2 2 2 2 2 4 .    face (pink)
//  4: . 4 2 1 3 3 1 2 4 .    eyes (yellow) + spots (dark blue)
//  5: . 4 2 2 2 2 2 2 4 .    face (pink)
//  6: . . 4 2 2 2 2 4 . .    chin
//  7: . . . 4 4 4 4 . . .    body (black)
//  8: . . . 3 . . 3 . . .    legs (dark blue)
//  9: . . . . . . . . . .
var COW_PATTERN = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,1,0,0,0,0,1,0,0],
  [0,4,4,4,4,4,4,4,4,0],
  [0,4,2,2,2,2,2,2,4,0],
  [0,4,2,1,3,3,1,2,4,0],
  [0,4,2,2,2,2,2,2,4,0],
  [0,0,4,2,2,2,2,4,0,0],
  [0,0,0,4,4,4,4,0,0,0],
  [0,0,0,3,0,0,3,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
];

// ── Level registry ───────────────────────────────────────────
var LEVELS = [
  { name: '企鹅', pattern: PENGUIN_PATTERN },
  { name: '小猫', pattern: CAT_PATTERN },
  { name: '小狗', pattern: DOG_PATTERN },
  { name: '小牛', pattern: COW_PATTERN },
];

// Node.js / CommonJS export (for solver.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LEVELS, PENGUIN_PATTERN, CAT_PATTERN, DOG_PATTERN, COW_PATTERN };
}
