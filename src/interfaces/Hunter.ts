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

  inventory?: string[];
  advancedMoves?: AdvancedMove[];
  customProps?: CustomProp[];
}

interface AdvancedMove {
  key: string;
  value: string;
}

export interface CustomProp {
  key: string,
  value: number
}
