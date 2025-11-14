import { Request, Response, NextFunction } from 'express';
export declare const getUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createUser: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=users.d.ts.map