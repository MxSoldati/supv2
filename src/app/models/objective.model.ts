export interface ObjectiveSupplement {
  name: string;
  description: string;
}

export interface ObjectiveCombo {
  name: string;
  desc: string;
  explanation: string;
}

export interface Objective {
  id: string;
  title: string;
  problem: string;
  supplements: ObjectiveSupplement[];
  combo: ObjectiveCombo;
}
