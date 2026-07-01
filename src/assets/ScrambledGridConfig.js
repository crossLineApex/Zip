const scrambleGridConfig = (gridConfig, scrambleRate = 0.8) => {
  if (!gridConfig) return [];

  const CORNER_SEQUENCE = [
    ["span-half-top", "span-half-right"], // Index 0: Top-Right
    ["span-half-right", "span-half-bottom"], // Index 1: Right-Bottom
    ["span-half-bottom", "span-half-left"], // Index 2: Bottom-Left
    ["span-half-left", "span-half-top"], // Index 3: Left-Top
  ];

  return gridConfig.map((row) =>
    row.map((cell) => {
      const scrambledCell = { ...cell };

      // RULE 1: If no lines are present, or if it's a locked numbered node, skip completely
      if (
        !cell.lines ||
        cell.lines.length === 0 ||
        (cell.number !== undefined && cell.number !== null)
      ) {
        return scrambledCell;
      }

      // RULE 2: TARGET PERCENTAGE CONTROL
      // If the random roll is higher than our rate, bypass scramble entirely
      // and leave this cell exactly as it is in the original layout config.
      if (Math.random() >= scrambleRate) {
        return scrambledCell;
      }

      const currentLines = cell.lines;

      // RULE 3: GUARANTEED FLIP FOR STRAIGHT TRACKS
      // Instead of rolling a 50/50 chance, forcefully invert it to the opposite state
      if (
        currentLines.includes("span-horizontal") ||
        currentLines.includes("span-vertical")
      ) {
        scrambledCell.lines = currentLines.includes("span-horizontal")
          ? ["span-vertical"]
          : ["span-horizontal"];
        return scrambledCell;
      }

      // RULE 4: GUARANTEED ROTATION FOR CORNER TRACKS
      const hasTop = currentLines.includes("span-half-top");
      const hasRight = currentLines.includes("span-half-right");
      const hasBottom = currentLines.includes("span-half-bottom");
      const hasLeft = currentLines.includes("span-half-left");

      let currentIdx = -1;
      if (hasTop && hasRight) currentIdx = 0;
      else if (hasRight && hasBottom) currentIdx = 1;
      else if (hasBottom && hasLeft) currentIdx = 2;
      else if (hasLeft && hasTop) currentIdx = 3;

      if (currentIdx !== -1) {
        // By changing multiplying scale to 3 and adding 1, our options become exactly [1, 2, or 3]
        // This completely eliminates an offset of 0, guaranteeing a structural visual rotation!
        const forcedRotationOffset = Math.floor(Math.random() * 3) + 1;
        const newIdx = (currentIdx + forcedRotationOffset) % 4;

        scrambledCell.lines = CORNER_SEQUENCE[newIdx];
      }

      return scrambledCell;
    })
  );
};

export default scrambleGridConfig;
