export interface Hunter {
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
  advancedMoves: AdvancedMove[];
}

interface AdvancedMove {
  key: string;
  value: string;
}
