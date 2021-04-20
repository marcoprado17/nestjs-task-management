import {config} from 'dotenv';
import * as nconf from 'nconf';
import defaultConfig from './default.config';
import devConfig from './dev.config';
import stageConfig from './stage.config';
import prodConfig from './prod.config';
import {all as deepMergeAll} from 'deepmerge';
import { Logger } from '@nestjs/common';

config();

nconf.env('__');

const logger = new Logger('AppConfig');

if(process.env.NODE_ENV === 'dev') {
    nconf.overrides(deepMergeAll([defaultConfig, devConfig]));
} else if(process.env.NODE_ENV === 'stage') {
    nconf.overrides(deepMergeAll([defaultConfig, stageConfig]));
} else if(process.env.NODE_ENV === 'prod') {
    nconf.overrides(deepMergeAll([defaultConfig, prodConfig]));
} else {
    throw new Error(`NODE_ENV must be 'dev', 'stage' or 'prod'`);
}

nconf.required([
    'server:port',
    'server:enableCors',
    'jwt:secret',
    'jwt:expiresIn',
    'db:type',
    'db:host',
    'db:port',
    'db:database',
    'db:username',
    'db:password',
    'db:synchronize'
]);

class ServerConfig {
    readonly port: number;
    readonly enableCors: boolean;

    constructor() {
        this.port = nconf.get('server:port');
        this.enableCors = nconf.get('server:enableCors');
    }
}

class JwtConfig {
    readonly secret: string;
    readonly expiresIn: number;

    constructor() {
        this.secret = nconf.get('jwt:secret');
        this.expiresIn = nconf.get('jwt:expiresIn');
    }
}

class DbConfig {
    readonly type: 'mysql' | 'mariadb';
    readonly host: string;
    readonly port: number;
    readonly database: string;
    readonly username: string;
    readonly password: string;
    readonly synchronize: boolean;

    constructor() {
        this.type = nconf.get('db:type');
        this.host = nconf.get('db:type');
        this.host = nconf.get('db:host');
        this.port = nconf.get('db:port');
        this.database = nconf.get('db:database');
        this.username = nconf.get('db:username');
        this.password = nconf.get('db:password');
        this.synchronize = nconf.get('db:synchronize');
    }
}

class AppConfig {
    readonly db: DbConfig;
    readonly jwt: JwtConfig;
    readonly server: ServerConfig;

    constructor() {
        this.db = new DbConfig();
        this.jwt = new JwtConfig();
        this.server = new ServerConfig();
    }
}

const appConfig = new AppConfig();

export default appConfig;
