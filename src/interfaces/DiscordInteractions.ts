/**
 * TODO: make options support more than just strings for value - for instance, numbers
 * options [
  { value: 1, type: 4, name: 'charm' },
  { value: 2, type: 4, name: 'cool' },
  { value: 3, type: 4, name: 'sharp' },
  { value: 2, type: 4, name: 'tough' },
  { value: 1, type: 4, name: 'weird' },
  { value: 'The Monstrous', type: 3, name: 'hunter-type' },
  { value: 'This', type: 3, name: 'first-name' },
  { value: 'Guy', type: 3, name: 'last-name' }
 */


export interface Option {
  name: string,
  type?: number
  value?: string
  options?: Option[]
}

export interface OptionV2 {
  name: string,
  type?: number
  value?: string | number
  options?: Option[]
}

export interface textInput {
  type: number
  custom_id: string
  style: number
  label: string
  min_length?: number
  max_length?: number
  required?: boolean
  value?: string
  placeholder?: string
}

export interface IModalSubmissionFields {
  custom_id: string;
  value: string;
  type: number;
}

export interface IOuterModalSubmissionComponent {
  type: number;
  components: IModalSubmissionFields[];
}

export interface IModalSubmissionData {
  custom_id: string;
  components: IOuterModalSubmissionComponent[];
}