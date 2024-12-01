export interface Option {
  name: string,
  type?: number
  value?: string
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