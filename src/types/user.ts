export interface User {
  _id?: string;
  email: string;
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