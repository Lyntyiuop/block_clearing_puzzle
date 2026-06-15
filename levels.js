// ============================================================
//  Shared Level Data — loaded by both index.html and solver.js
//  Edit patterns here; both files pick up changes automatically.
// ============================================================
//
//  Color legend:
//    0 = EMPTY
//    1 = YELLOW  (matches LEFT border)
//    2 = PINK    (matches TOP border)
//    3 = DARK_BLUE (matches RIGHT border)
//    4 = BLACK   (matches BOTTOM border)
//
//  Penguin pixel art (10×10):
//
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
// ============================================================

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

// Node.js / CommonJS export (for solver.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PENGUIN_PATTERN };
}
