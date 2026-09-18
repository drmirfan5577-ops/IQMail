import { User } from '@/types';

const USER_KEY = 'iqmail_user';
const USERS_KEY = 'iqmail_users';

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function getAllUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function emailExists(email: string): boolean {
  const users = getAllUsers();
  return users.some((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function registerUser(fullName: string, email: string): User {
  const users = getAllUsers();
  const newUser: User = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    fullName,
    email,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  setStoredUser(newUser);
  return newUser;
}

export function sendWelcomeEmail(user: User): Promise<boolean> {
  // Simulated email send – in production, call Resend API via Edge Function
  console.log(`[IQMAIL] Sending welcome email to ${user.email}...`);
  console.log(`[IQMAIL] Welcome, ${user.fullName}! Your IQMAIL account is ready.`);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[IQMAIL] Welcome email delivered successfully to ${user.email}`);
      resolve(true);
    }, 800);
  });
}
