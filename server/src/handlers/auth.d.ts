import { Request, Response, NextFunction } from 'express';
export declare const login: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const logout: (req: Request, res: Response, next: NextFunction) => void;
export declare const refresh: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.d.ts.map