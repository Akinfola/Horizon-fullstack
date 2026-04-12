export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address?: string;
  state?: string;
  postalCode?: string;
  dateOfBirth?: string;
  ssn?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}