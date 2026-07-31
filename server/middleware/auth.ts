import { Request, Response, NextFunction } from 'express';
import { getDevBypassUser, isDevAuthBypassEnabled } from './devBypass';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: 'ADMIN' | 'SUPER_ADMIN';
        avatar: string;
      };
    }
  }
}

async function autoLoginDevUser(req: Request): Promise<boolean> {
  try {
    const user = await getDevBypassUser();
    if (!user) return false;
    req.session.userId = user.id;
    req.session.userRole = user.role;
    req.session.userName = user.name;
    req.user = { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar };
    return true;
  } catch {
    return false;
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (isDevAuthBypassEnabled()) {
    if (!req.session?.userId) {
      await autoLoginDevUser(req);
    }
    if (req.session?.userId) {
      return next();
    }
  }
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }
  next();
}

export function requireRole(...roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (isDevAuthBypassEnabled()) {
      if (!req.session?.userId) {
        await autoLoginDevUser(req);
      }
      if (req.session?.userId) {
        if (roles.includes(req.session.userRole || '')) {
          return next();
        }
        return res.status(403).json({ error: 'Forbidden. Insufficient permissions.' });
      }
    }
    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
    if (!roles.includes(req.session.userRole || '')) {
      return res.status(403).json({ error: 'Forbidden. Insufficient permissions.' });
    }
    next();
  };
}
