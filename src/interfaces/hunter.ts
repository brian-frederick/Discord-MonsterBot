export interface hunter {
  userId: string;
  firstName: string;
  lastName: string;
  type: string;

  // vitals
  experience: number;
  harm: number;
  luck: number;

  //stats
  charm: number;
  cool: number;
  sharp: number;
  tough: number;
  weird: number;

  // other
  inventory: string[];
  advancedMoves: advancedMove[];
}

interface advancedMove {
  key: string;
  value: string;
}
