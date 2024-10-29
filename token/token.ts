import jwt, { SignOptions } from "jsonwebtoken";

interface UserPayload {
    id:string;
    role:string;
}

interface TokenPair {
    access_token:string;
    refresh_token: string;
}


export class JWTService  {
    private readonly secretKey: string;
    private readonly accessTokenExpirationTime: string;
    private readonly refreshTokenExpirationTime: string;

    constructor(secretKey:string, accessTokenExpirationTime:string, refreshTokenExpirationTime:string) {
        this.secretKey = secretKey;
        this.accessTokenExpirationTime = accessTokenExpirationTime;
        this.refreshTokenExpirationTime = refreshTokenExpirationTime;
    }

    public generateToken(payload: UserPayload): TokenPair {
        const access_token_options: SignOptions = {expiresIn: this.accessTokenExpirationTime };
        const refresh_token_options: SignOptions = { expiresIn: this.refreshTokenExpirationTime };

        const access_token: string = jwt.sign(payload, this.secretKey, access_token_options);
        const refresh_token: string = jwt.sign(payload, this.secretKey, refresh_token_options);

        return { access_token, refresh_token };
    }

    public verifyToken(token: string): UserPayload | null {
        try {
            const decoded = jwt.verify(token, this.secretKey)
            return decoded as UserPayload;
        }catch(err) {
            console.error('Error verifying token:', err);
            return null;
        }
    }

    public decodeToken(token:string): UserPayload | null {
        try {
            return jwt.decode(token) as UserPayload | null;
        } catch(err) {
            console.error('Error decoding token:', err);
            return null;
        }
    }


}


