import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import appConfig from './app.config';

const typeOrmConfig: TypeOrmModuleOptions = {
    type: appConfig.db.type,
    host: appConfig.db.host,
    port: appConfig.db.port,
    username: appConfig.db.username,
    password: appConfig.db.password,
    database: appConfig.db.database,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: appConfig.db.synchronize
};

export {typeOrmConfig};
