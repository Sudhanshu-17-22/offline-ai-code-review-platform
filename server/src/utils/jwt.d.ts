export interface JwtPayload {
    userId: string;
}
export declare const generateToken: (userId: string) => string;
export declare const verifyToken: (token: string) => JwtPayload;
//# sourceMappingURL=jwt.d.ts.map