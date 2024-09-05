import { registerAs } from "@nestjs/config";
import { JwtSignOptions } from "@nestjs/jwt";
require('dotenv').config();
export default registerAs('jwt-pass',
    () : JwtSignOptions=>({   
    secret: process.env.RESET_TOKEN_SECRET,
    expiresIn: process.env.JWT_EXPIRE_IN
}))