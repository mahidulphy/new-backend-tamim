import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    userRole: 'ADMIN' | 'SUPER_ADMIN';
    userName: string;
  }
}
