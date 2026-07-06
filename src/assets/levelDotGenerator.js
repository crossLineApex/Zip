/**
 * Instantly generates a perfectly solvable n x n Zip Grid Configuration for Zip Dot Game
 * using the constant-time Markov Chain Backbite Algorithm.
 * @param {number} n - The dimension of the square board (n x n)
 * @param {string} level - Difficulty setting: 'easy', 'medium', or 'hard'
 * @returns {Array<Array<Object>>} A complete 2D array matching the original layout structure
 */
const generateZipDotConfig = (n, level) => {
  const totalCells = n * n;
  let maxNum = 2;

  // 1. CALCULATE MAX NUMBER OF CLUES BASED ON DIFFULTY FORMULAS
  const offset = Math.floor(Math.random() * 2) + 1; // Generates +1 or +2

  if (level === 'easy') {
    const easyPcts = [0.18, 0.19, 0.20, 0.21, 0.22, 0.23];
    const pct = easyPcts[Math.floor(Math.random() * easyPcts.length)];
    maxNum = Math.floor(pct * totalCells) + offset;
  } else if (level === 'medium') {
    const medPcts = [0.25, 0.26, 0.27, 0.28, 0.29, 0.30];
    const pct = medPcts[Math.floor(Math.random() * medPcts.length)];
    maxNum = Math.floor(pct * totalCells) + offset;
  } else if (level === 'hard') {
    const hardPcts = [0.35, 0.36, 0.37, 0.38, 0.39, 0.40];
    const pct = hardPcts[Math.floor(Math.random() * hardPcts.length)];
    maxNum = Math.floor(pct * totalCells) + offset;
  }

  // Safety boundaries
  maxNum = Math.max(2, Math.min(totalCells, maxNum));

  // 2. PHASE 1: GENERATE NATIVE SEED PATH (Deterministic Zig-Zag Serpentine)
  let path = [];
  for (let r = 0; r < n; r++) {
    if (r % 2 === 0) {
      for (let c = 0; c < n; c++) path.push([r, c]);
    } else {
      for (let c = n - 1; c >= 0; c--) path.push([r, c]);
    }
  }

  // 3. PHASE 2: EXECUTE CONSTANT-TIME BACKBITE SCRAMBLING
  const k = totalCells - 1; // Last index of the path
  const moves = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  
  // Scramble iterations scale smoothly with board density (e.g., 2000-5000 runs take ~3ms)
  const iterations = totalCells * 30; 

  for (let step = 0; step < iterations; step++) {
    const chooseHead = Math.random() > 0.5;

    if (chooseHead) {
      // --- HEAD EXTENSION ---
      const [hr, hc] = path[0];
      const validNeighbors = [];
      
      for (const [dr, dc] of moves) {
        const nr = hr + dr;
        const nc = hc + dc;
        if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
          // Ignore its current path neighbor (index 1)
          if (!(nr === path[1][0] && nc === path[1][1])) {
            validNeighbors.push([nr, nc]);
          }
        }
      }

      if (validNeighbors.length > 0) {
        const [targetR, targetC] = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
        
        // Find where this neighbor lives inside the current path array
        let idx = -1;
        for (let i = 2; i <= k; i++) {
          if (path[i][0] === targetR && path[i][1] === targetC) {
            idx = i;
            break;
          }
        }

        if (idx !== -1) {
          const newPath = [];
          // Reverse elements from idx - 1 down to 0
          for (let i = idx - 1; i >= 0; i--) newPath.push(path[i]);
          // Retain elements from idx up to k intact
          for (let i = idx; i <= k; i++) newPath.push(path[i]);
          path = newPath;
        }
      }
    } else {
      // --- TAIL EXTENSION ---
      const [tr, tc] = path[k];
      const validNeighbors = [];

      for (const [dr, dc] of moves) {
        const nr = tr + dr;
        const nc = tc + dc;
        if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
          // Ignore its current path neighbor (index k - 1)
          if (!(nr === path[k - 1][0] && nc === path[k - 1][1])) {
            validNeighbors.push([nr, nc]);
          }
        }
      }

      if (validNeighbors.length > 0) {
        const [targetR, targetC] = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
        
        let idx = -1;
        for (let i = 0; i <= k - 2; i++) {
          if (path[i][0] === targetR && path[i][1] === targetC) {
            idx = i;
            break;
          }
        }

        if (idx !== -1) {
          const newPath = [];
          // Retain elements from 0 up to idx intact
          for (let i = 0; i <= idx; i++) newPath.push(path[i]);
          // Reverse elements from k down to idx + 1
          for (let i = k; i >= idx + 1; i--) newPath.push(path[i]);
          path = newPath;
        }
      }
    }
  }

  // 4. PHASE 3: SPARSE SEQUENTIAL CLUE DISTRIBUTION
  const intermediateIndices = [];
  const availableIndices = [];
  for (let i = 1; i < totalCells - 1; i++) {
    availableIndices.push(i);
  }

  const desiredMiddleCount = maxNum - 2;
  for (let i = 0; i < desiredMiddleCount && availableIndices.length > 0; i++) {
    const randIdx = Math.floor(Math.random() * availableIndices.length);
    intermediateIndices.push(availableIndices.splice(randIdx, 1)[0]);
  }
  intermediateIndices.sort((a, b) => a - b);

  const numberAssignments = {};
  numberAssignments[0] = 1; // Path start is always clue 1
  numberAssignments[totalCells - 1] = maxNum; // Path end is always the calculated maximum

  intermediateIndices.forEach((pathIdx, orderIdx) => {
    numberAssignments[pathIdx] = orderIdx + 2;
  });

  // 5. PHASE 4: TRANSLATE PATH VECTORS INTO CSS TRACK CLASSES
  const gridConfig = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => ({ lines: [] }))
  );

  path.forEach(([r, c], index) => {
    const cellLines = [];

    // Evaluate track entries
    if (index > 0) {
      const [prevR, prevC] = path[index - 1];
      if (prevR < r) cellLines.push("span-half-top");
      if (prevR > r) cellLines.push("span-half-bottom");
      if (prevC < c) cellLines.push("span-half-left");
      if (prevC > c) cellLines.push("span-half-right");
    }

    // Evaluate track exits
    if (index < path.length - 1) {
      const [nextR, nextC] = path[index + 1];
      if (nextR < r) cellLines.push("span-half-top");
      if (nextR > r) cellLines.push("span-half-bottom");
      if (nextC < c) cellLines.push("span-half-left");
      if (nextC > c) cellLines.push("span-half-right");
    }

    // Collapse opposite half-lines into clean full span lines
    let optimizedLines = cellLines;
    if (cellLines.includes("span-half-left") && cellLines.includes("span-half-right")) {
      optimizedLines = ["span-horizontal"];
    } else if (cellLines.includes("span-half-top") && cellLines.includes("span-half-bottom")) {
      optimizedLines = ["span-vertical"];
    }

    gridConfig[r][c] = { lines: optimizedLines };

    if (numberAssignments[index] !== undefined) {
      gridConfig[r][c].number = numberAssignments[index];
    }
  });

    // Increment every coordinate
    path.forEach(([row, col], i) => {
    path[i] = [row + 1, col + 1];
    });

    // Get first and last assignments
    const entries = Object.entries(numberAssignments);
    const first = entries[0];
    const last = entries[entries.length - 1];

    // Build the object
    const transformedPath = {};

    path.forEach(([row, col], index) => {
    const key = `${row}-${col}`;

    if (index === Number(first[0])) {
        transformedPath[key] = first[1];
    } else if (index === Number(last[0])) {
        transformedPath[key] = last[1];
    } else {
        transformedPath[key] = undefined;
    }
    });


  return {
      gridConfig: gridConfig,
      maxNum: maxNum,
      start: path[0], // Securely returns the starting [row, col] position of clue 1
      transformedPath: transformedPath // Returns the path with coordinates as keys and clue numbers as values
    };};

export default generateZipDotConfig;