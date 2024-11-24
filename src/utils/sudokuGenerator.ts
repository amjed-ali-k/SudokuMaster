type Grid = number[][];

interface SudokuPuzzle {
  initial: Grid;
  current: Grid;
  solution: Grid;
}

const generateSudoku = (difficulty: number): SudokuPuzzle => {
  // Initialize empty 9x9 grid
  const grid: Grid = Array(9).fill(null).map(() => Array(9).fill(0));
  
  // Fill diagonal boxes first (which are independent of each other)
  fillDiagonalBoxes(grid);
  
  // Fill remaining cells
  fillRemaining(grid, 0, 3);
  
  // Create a copy of the solved grid
  const solvedGrid: Grid = grid.map(row => [...row]);
  
  // Remove numbers based on difficulty (1-10)
  const cellsToRemove = 35 + (10 - difficulty) * 5; // 35-80 empty cells
  removeNumbers(grid, cellsToRemove);
  
  return {
    initial: grid.map(row => [...row]),
    current: grid.map(row => [...row]),
    solution: solvedGrid,
  };
};

const fillDiagonalBoxes = (grid: Grid): void => {
  for (let box = 0; box < 9; box += 3) {
    fillBox(grid, box, box);
  }
};

const fillBox = (grid: Grid, row: number, col: number): void => {
  const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let index = 0;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      grid[row + i][col + j] = numbers[index];
      index++;
    }
  }
};

const fillRemaining = (grid: Grid, row: number, col: number): boolean => {
  if (col >= 9 && row < 8) {
    row++;
    col = 0;
  }
  if (row >= 9 && col >= 9) return true;
  if (row < 3) {
    if (col < 3) col = 3;
  } else if (row < 6) {
    if (col === Math.floor(row / 3) * 3) col += 3;
  } else {
    if (col === 6) {
      row++;
      col = 0;
      if (row >= 9) return true;
    }
  }

  for (let num = 1; num <= 9; num++) {
    if (isSafe(grid, row, col, num)) {
      grid[row][col] = num;
      if (fillRemaining(grid, row, col + 1)) return true;
      grid[row][col] = 0;
    }
  }
  return false;
};

const isSafe = (grid: Grid, row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }
  
  // Check box
  const startRow = row - row % 3;
  const startCol = col - col % 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }
  
  return true;
};

const removeNumbers = (grid: Grid, count: number): void => {
  let removed = 0;
  while (removed < count) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (grid[row][col] !== 0) {
      grid[row][col] = 0;
      removed++;
    }
  }
};

const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const validateMove = (grid: Grid, row: number, col: number, num: number): boolean => {
  // Check if the number already exists in the row
  for (let x = 0; x < 9; x++) {
    if (x !== col && grid[row][x] === num) return false;
  }

  // Check if the number already exists in the column
  for (let x = 0; x < 9; x++) {
    if (x !== row && grid[x][col] === num) return false;
  }

  // Check if the number already exists in the 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (
        (boxRow + i !== row || boxCol + j !== col) &&
        grid[boxRow + i][boxCol + j] === num
      ) {
        return false;
      }
    }
  }

  return true;
};

const checkCompletion = (grid: Grid): boolean => {
  // Check if all cells are filled
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) return false;
    }
  }

  // Check if all rows are valid
  for (let row = 0; row < 9; row++) {
    const numbers = new Set<number>();
    for (let col = 0; col < 9; col++) {
      numbers.add(grid[row][col]);
    }
    if (numbers.size !== 9) return false;
  }

  // Check if all columns are valid
  for (let col = 0; col < 9; col++) {
    const numbers = new Set<number>();
    for (let row = 0; row < 9; row++) {
      numbers.add(grid[row][col]);
    }
    if (numbers.size !== 9) return false;
  }

  // Check if all 3x3 boxes are valid
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const numbers = new Set<number>();
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          numbers.add(grid[boxRow + i][boxCol + j]);
        }
      }
      if (numbers.size !== 9) return false;
    }
  }

  return true;
};

export {
  generateSudoku,
  validateMove,
  checkCompletion,
  type Grid,
  type SudokuPuzzle,
};
