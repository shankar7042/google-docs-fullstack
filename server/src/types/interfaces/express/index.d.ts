declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export {};
