export interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  user?: User;
}

export type PasswordStrength = 'none' | 'weak' | 'fair' | 'good' | 'strong';
