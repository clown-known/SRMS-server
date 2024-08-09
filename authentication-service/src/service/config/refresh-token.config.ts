import { registerAs } from "@nestjs/config";
import {  JwtModuleOptions, JwtSignOptions } from "@nestjs/jwt";
require('dotenv').config();
export default registerAs('refresh-jwt',
    () : JwtSignOptions=>({   
    secret: process.env.REFRESH_TOKEN_SECRET,
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN
}))