/**
 * Structurally expands a grid for Zip Dot by inserting a top row of dots 
 * at the beginning, and a leading dot cell at the beginning of every original row.
 * @param {Array<Array<Object>>} standardGrid - Output matrix from generateZipGridConfig
 * @returns {Array<Array<Object>>} The structurally padded grid matrix
 */
const convertToZipDot = (standardGrid, maxNum, numbersToKeep) => {
  if (!standardGrid || standardGrid.length === 0) return [];

  // 1. Process the existing rows first: insert a dot cell AT THE BEGINNING of each row
  const paddedRows = standardGrid.map((row) => [
    { lines: [""], dot: true },         // Added at the beginning of the row
    ...row.map((cell) => ({ ...cell })) // Followed by copies of the original cells
  ]);

  // 2. Create the top row of dots (matching the new expanded column width)
  const expandedLength = paddedRows[0].length;
  const topDotRow = Array.from({ length: expandedLength }, () => ({
    lines: [""],
    dot: true,
  }));

  const dotGrid = [topDotRow, ...paddedRows]; 

  if (!dotGrid || dotGrid.length === 0) {
    return { gridConfig: [], initialDots: {} };
  }

  const totalRows = dotGrid.length;
  const totalCols = dotGrid[0].length;
  const initialDots = {};

  // ============================================================================
  // 1. GENERATE THE INITIALDOTS METADATA
  // ============================================================================

  // Step A: Scan Columns (Row 0 markers -> "0-C")
  // We start at column 1 to leave the corner 0-0 dot blank
  for (let c = 1; c < totalCols; c++) {
    const colTags = [];
    for (let r = 1; r < totalRows; r++) {
      const num = dotGrid[r][c].number;
      if (num !== undefined && num !== null) {
        // "a" for end-anchors (1 or max), "d" for intermediate digits
        if (num === 1 || num === maxNum  || (numbersToKeep && numbersToKeep.includes(num))) {
          colTags.push("a");
        } else {
          colTags.push("d");
        }
      }
    }
    if (colTags.length > 0) {
      initialDots[`0-${c}`] = colTags;
    }
  }

  // Step B: Scan Rows (Column 0 markers -> "R-0")
  // We start at row 1 to leave the corner 0-0 dot blank
  for (let r = 1; r < totalRows; r++) {
    const rowTags = [];
    for (let c = 1; c < totalCols; c++) {
      const num = dotGrid[r][c].number;
      if (num !== undefined && num !== null) {
        if (num === 1 || num === maxNum || (numbersToKeep && numbersToKeep.includes(num))) {
          rowTags.push("a");
        } else {
          rowTags.push("d");
        }
      }
    }
    if (rowTags.length > 0) {
      initialDots[`${r}-0`] = rowTags;
    }
  }

    // ============================================================================
    // INJECT NO-CLICK LOCKS ON EMPTY AXIS TRACKS
    // Uses initialDots keys as a lightning-fast lookup map instead of loops
    // ============================================================================
    const gridWithLocks = dotGrid.map((row, r) =>
    row.map((cell, c) => {
        // If it's a boundary tracking dot cell, pass it through unchanged
        if (cell.dot) return { ...cell };

        // A row has clues if its tracking key (e.g. "2-0") exists in initialDots
        const rowHasNoNumbers = !initialDots[`${r}-0`];
        
        // A column has clues if its tracking key (e.g. "0-5") exists in initialDots
        const colHasNoNumbers = !initialDots[`0-${c}`];

        // If EITHER axis completely lacks clues, lock the cell down
        if (rowHasNoNumbers || colHasNoNumbers) {
        return { ...cell, noClick: true };
        }

        return { ...cell };
    })
    );

  // ============================================================================
  // STRIP INTERMEDIATE NUMBERS FROM THE GRID LAYOUT
  // ============================================================================
  const cleanedGrid = gridWithLocks.map((row, r) =>
    row.map((cell, c) => {
      // If it's a boundary dot cell, return it immediately without altering it
      if (cell.dot) return { ...cell };

      // Clone inner cell to protect upstream memory references
      const cellCopy = { ...cell };

      // Wipe out the number property unless it is 1 or the max target anchor
      if (cellCopy.number !== undefined && cellCopy.number !== null) {
        if (cellCopy.number !== 1 && cellCopy.number !== maxNum && (numbersToKeep && !numbersToKeep.includes(cellCopy.number))) {
          delete cellCopy.number;
        }
      }

      return cellCopy;
    })
  );

const numberBarChoices = Array.from({ length: maxNum - 2 }, (_, i) => i + 2)
  .filter(num => !numbersToKeep.includes(num));
  
  return { dotGrid: cleanedGrid, initialDots, numberBarChoices };
};

export default convertToZipDot;