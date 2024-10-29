import { newEnforcer } from "casbin";
import { JWTService } from "../token/token";
import { Request, Response, NextFunction } from "express";

export class CasbinEnforces {
    private enforcer:any;
    private jwtService: JWTService

    constructor(model_path:string, policy_path:string, jwt:JWTService) {
        this.enforcer = this.createEnforcer(model_path, policy_path);
        this.jwtService = jwt;

    }

    private async createEnforcer(model_path:string, policy_path:string): Promise<any> {
        return await newEnforcer(model_path, policy_path);
    }

    public async enforcePolicy(req:Request, res:Response, next:NextFunction) {
        const authHeader = req.headers['authorization'];
        console.log(authHeader);
        if (authHeader) {
            const tokenValue = this.jwtService.decodeToken(authHeader)
            if (tokenValue !== null) {
                const { id, role } = tokenValue;
                const isAllowed = await this.enforcer.enforce(id, req.method, req.url);
                if (isAllowed) {
                    next();
                } else {
                    return res.status(403).send({ message: 'Access denied' });
                }
            }
        }
        return res.status(403).send({ message: 'Access denied' });
    }

}