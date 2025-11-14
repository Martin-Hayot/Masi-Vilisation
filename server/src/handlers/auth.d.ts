import { Request, Response, NextFunction } from 'express';
export declare const login: (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const logout: (req: Request, res: Response, next: NextFunction) => void;
export declare const refresh: (req: Request, res: Response, next: NextFunction) => Promise<any>;
//# sourceMappingURL=auth.d.ts.map