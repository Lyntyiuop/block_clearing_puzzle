// ============================================================
//  Block Clearing Puzzle — Mini-Program Game Logic
// ============================================================

var LEVELS_DATA = require('../../utils/levels.js');
var LEVELS = LEVELS_DATA.LEVELS;

// ── Constants ─────────────────────────────────────────────────
var ROWS = 10;
var COLS = 10;
var EMPTY = 0;
var YELLOW = 1;      // matches LEFT border
var PINK = 2;        // matches TOP border
var DARK_BLUE = 3;   // matches RIGHT border
var BLACK = 4;       // matches BOTTOM border

var DIR = { UP: 'up', DOWN: 'down', LEFT: 'left', RIGHT: 'right' };

// ── Utility ───────────────────────────────────────────────────
function delay(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}

// ── Page ──────────────────────────────────────────────────────
Page({
  data: {
    // Board rendering
    blocks: [],           // [{id, row, col, color, eliminating}]
    cellSize: 0,
    boardSize: 0,
    borderSize: 0,

    // Game state
    moveCount: 0,
    levelIndex: 0,
    totalLevels: LEVELS.length,
    levelName: '',
    won: false,
    hasNextLevel: false,
    isAnimating: false,

    // UI
    hintText: '↑↓←→ 滑动屏幕来玩',
    hintClass: '',
    winTitle: '',
    winMoves: '',
  },

  // Internal state (not in data for performance)
  board: [],          // 2D array: board[r][c] = color (0-4)
  nextBlockId: 0,

  // ── Lifecycle ───────────────────────────────────────────────
  onLoad: function() {
    this.computeCellSize();
    this.initLevel(0);
  },

  // ── Cell Size Calculation ───────────────────────────────────
  computeCellSize: function() {
    var sysInfo = wx.getSystemInfoSync();
    var vw = sysInfo.windowWidth;
    var vh = sysInfo.windowHeight;
    // Board is 10 cells + 2 border cells = 12 cells; leave 40px padding
    var maxByWidth = Math.floor((vw - 40) / 12);
    // Reserve ~150px for title, status bar, navigation bar
    var maxByHeight = Math.floor((vh - 150) / 12);
    var size = Math.min(maxByWidth, maxByHeight, 48);
    size = Math.max(size, 24); // minimum 24px per cell

    this.setData({
      cellSize: size,
      boardSize: size * COLS,
      borderSize: size,
    });
  },

  // ── Level Initialization ────────────────────────────────────
  initLevel: function(index) {
    if (index < 0 || index >= LEVELS.length) return;

    var level = LEVELS[index];
    // Deep copy the pattern
    var board = [];
    for (var r = 0; r < ROWS; r++) {
      board[r] = [];
      for (var c = 0; c < COLS; c++) {
        board[r][c] = level.pattern[r][c];
      }
    }

    this.board = board;
    this.nextBlockId = 0;
    this.setData({
      levelIndex: index,
      levelName: level.name,
      moveCount: 0,
      won: false,
      hasNextLevel: index < LEVELS.length - 1,
      hintText: '↑↓←→ 滑动屏幕来玩',
      hintClass: '',
    });
    this.renderBlocks();
  },

  // ── Render blocks from board ────────────────────────────────
  renderBlocks: function() {
    var blocks = [];
    var id = this.nextBlockId;
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        if (this.board[r][c] !== EMPTY) {
          blocks.push({
            id: id++,
            row: r,
            col: c,
            color: this.board[r][c],
            eliminating: false,
          });
        }
      }
    }
    this.nextBlockId = id;
    this.setData({ blocks: blocks });
  },

  // ── Build blocks array from board (preserving elimination state where possible) ──
  buildBlocks: function() {
    var blocks = [];
    var id = this.nextBlockId;
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        if (this.board[r][c] !== EMPTY) {
          blocks.push({
            id: id++,
            row: r,
            col: c,
            color: this.board[r][c],
            eliminating: false,
          });
        }
      }
    }
    this.nextBlockId = id;
    return blocks;
  },

  // ── Core: Slide ─────────────────────────────────────────────
  slide: function(dir) {
    var board = this.board;
    var changed = false;
    var r, c, blocks, nv, idx;

    if (dir === DIR.LEFT) {
      for (r = 0; r < ROWS; r++) {
        blocks = [];
        for (c = 0; c < COLS; c++) {
          if (board[r][c] !== EMPTY) blocks.push(board[r][c]);
        }
        for (c = 0; c < COLS; c++) {
          nv = c < blocks.length ? blocks[c] : EMPTY;
          if (board[r][c] !== nv) changed = true;
          board[r][c] = nv;
        }
      }
    } else if (dir === DIR.RIGHT) {
      for (r = 0; r < ROWS; r++) {
        blocks = [];
        for (c = 0; c < COLS; c++) {
          if (board[r][c] !== EMPTY) blocks.push(board[r][c]);
        }
        for (c = 0; c < COLS; c++) {
          idx = c - (COLS - blocks.length);
          nv = idx >= 0 ? blocks[idx] : EMPTY;
          if (board[r][c] !== nv) changed = true;
          board[r][c] = nv;
        }
      }
    } else if (dir === DIR.UP) {
      for (c = 0; c < COLS; c++) {
        blocks = [];
        for (r = 0; r < ROWS; r++) {
          if (board[r][c] !== EMPTY) blocks.push(board[r][c]);
        }
        for (r = 0; r < ROWS; r++) {
          nv = r < blocks.length ? blocks[r] : EMPTY;
          if (board[r][c] !== nv) changed = true;
          board[r][c] = nv;
        }
      }
    } else if (dir === DIR.DOWN) {
      for (c = 0; c < COLS; c++) {
        blocks = [];
        for (r = 0; r < ROWS; r++) {
          if (board[r][c] !== EMPTY) blocks.push(board[r][c]);
        }
        for (r = 0; r < ROWS; r++) {
          idx = r - (ROWS - blocks.length);
          nv = idx >= 0 ? blocks[idx] : EMPTY;
          if (board[r][c] !== nv) changed = true;
          board[r][c] = nv;
        }
      }
    }

    return changed;
  },

  // ── Core: Find Eliminations ─────────────────────────────────
  findEliminations: function() {
    var targets = [];
    var board = this.board;
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var v = board[r][c];
        if (v === EMPTY) continue;
        if ((v === YELLOW && c === 0) ||
            (v === PINK && r === 0) ||
            (v === DARK_BLUE && c === COLS - 1) ||
            (v === BLACK && r === ROWS - 1)) {
          targets.push({ r: r, c: c });
        }
      }
    }
    return targets;
  },

  // ── Core: Win Check ─────────────────────────────────────────
  checkWin: function() {
    var board = this.board;
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        if (board[r][c] !== EMPTY) return false;
      }
    }
    return true;
  },

  // ── Main Move Handler ───────────────────────────────────────
  processMove: async function(direction) {
    var self = this;
    if (self.data.isAnimating) return;

    self.setData({ isAnimating: true, hintText: '', hintClass: '' });

    // Step 1: Initial slide
    var moved = self.slide(direction);
    if (!moved) {
      self.setData({
        isAnimating: false,
        hintText: '无法移动，换个方向试试',
        hintClass: 'hint',
      });
      setTimeout(function() {
        if (self.data.hintText === '无法移动，换个方向试试') {
          self.setData({ hintText: '↑↓←→ 滑动屏幕来玩', hintClass: '' });
        }
      }, 1500);
      return;
    }

    var newMoveCount = self.data.moveCount + 1;
    self.setData({
      blocks: self.buildBlocks(),
      moveCount: newMoveCount,
    });
    await delay(200); // Let slide animation complete

    // Step 2: Chain reaction loop
    while (true) {
      var targets = self.findEliminations();
      if (targets.length === 0) break;

      // Mark eliminated blocks — create new array to ensure setData triggers update
      var targetSet = {};
      for (var t = 0; t < targets.length; t++) {
        targetSet[targets[t].r + ',' + targets[t].c] = true;
      }
      var newBlocks = [];
      var currentBlocks = self.data.blocks;
      for (var i = 0; i < currentBlocks.length; i++) {
        var b = currentBlocks[i];
        var key = b.row + ',' + b.col;
        if (targetSet[key]) {
          // Create a new object with eliminating flag
          newBlocks.push({
            id: b.id,
            row: b.row,
            col: b.col,
            color: b.color,
            eliminating: true,
          });
          // Clear from internal board
          self.board[b.row][b.col] = EMPTY;
        } else {
          newBlocks.push(b);
        }
      }
      self.setData({ blocks: newBlocks });
      await delay(280); // Let elimination animation complete

      // Slide again to fill gaps
      self.slide(direction);
      self.setData({ blocks: self.buildBlocks() });
      await delay(200);
    }

    // Step 3: Check win
    if (self.checkWin()) {
      var hasNext = self.data.levelIndex < LEVELS.length - 1;
      self.setData({
        won: true,
        hasNextLevel: hasNext,
        winTitle: hasNext ? '🎉 本关通过！' : '🏆 全部通关！',
        winMoves: hasNext
          ? '你用了 ' + newMoveCount + ' 步完成了' + self.data.levelName + '关卡！'
          : '所有 ' + LEVELS.length + ' 关全部完成，总共用了 ' + newMoveCount + ' 步！',
        hintText: '✨ 全部消除！',
        hintClass: 'success',
      });
    }

    self.setData({ isAnimating: false });
  },

  // ── Touch Handlers ──────────────────────────────────────────
  onTouchStart: function(e) {
    if (this.data.isAnimating) return;
    var touch = e.touches[0];
    this._touchStartX = touch.clientX;
    this._touchStartY = touch.clientY;
    this._touchActive = true;
  },

  onTouchMove: function(e) {
    // Prevent default scrolling — handled by catch in WXML for end
  },

  onTouchEnd: function(e) {
    if (!this._touchActive || this.data.isAnimating) {
      this._touchActive = false;
      return;
    }
    this._touchActive = false;

    var touch = e.changedTouches[0];
    var dx = touch.clientX - this._touchStartX;
    var dy = touch.clientY - this._touchStartY;
    var absDx = Math.abs(dx);
    var absDy = Math.abs(dy);
    var threshold = 25;

    if (Math.max(absDx, absDy) < threshold) return; // Too small

    var direction;
    if (absDx > absDy) {
      direction = dx > 0 ? DIR.RIGHT : DIR.LEFT;
    } else {
      direction = dy > 0 ? DIR.DOWN : DIR.UP;
    }

    this.processMove(direction);
  },

  // ── Button Handlers ─────────────────────────────────────────
  onRestart: function() {
    if (this.data.isAnimating) return;
    this.initLevel(this.data.levelIndex);
  },

  onPrevLevel: function() {
    if (this.data.isAnimating) return;
    if (this.data.levelIndex > 0) {
      this.initLevel(this.data.levelIndex - 1);
    }
  },

  onNextLevel: function() {
    if (this.data.isAnimating) return;
    if (this.data.levelIndex < LEVELS.length - 1) {
      this.initLevel(this.data.levelIndex + 1);
    }
  },
});
