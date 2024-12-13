export enum InventoryTransaction {
  ADD = 'add',
  REMOVE = 'remove'
}

export enum MoveType {
  ActUnderPressure = 'aup',
  HelpOut = 'ho',
  InvestigateAMystery = 'iam',
  KickSomeAss = 'ksa',
  ManipulateSomeone = 'ms',
  ProtectSomeone = 'ps',
  ReadABadSituation = 'rabs',
  UseMagic = 'um'
}

export enum Vital {
  Experience = 'experience',
  Harm = 'harm',
  Luck = 'luck'
}

export enum Properties {
  charm = 'charm',
  cool = 'cool',
  sharp = 'sharp',
  tough = 'tough',
  weird = 'weird'
}

export enum Stat {
  charm = 'charm',
  cool = 'cool',
  sharp = 'sharp',
  tough = 'tough',
  weird = 'weird',
  Experience = 'experience',
  Harm = 'harm',
  Luck = 'luck'
}

export enum DiscordInteractionType {
  ping = 1,
  applicationCommand = 2,
  messageComponent = 3,
  applicationCommandAutocomplete = 4,
  modalSubmit = 5
}

export enum CustomMoveModalInputFields {
  description = 'description',
  low_outcome = 'low_outcome',
  middle_outcome = 'middle_outcome',
  high_outcome = 'high_outcome',
  advanced_outcome = 'advanced_outcome'
}


export enum ModalCustomIdNames {
  update_move = 'um',
}

export enum ButtonCustomIdNames {
  delete_move = 'dm',
  edit_move = 'em',
  mark = 'mark'
}