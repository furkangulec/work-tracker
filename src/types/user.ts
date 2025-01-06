export interface User {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  _id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
} 