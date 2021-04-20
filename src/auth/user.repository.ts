import { ConflictException } from "@nestjs/common";
import { Errors } from "src/errors.enum";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const {
            username,
            password
        } = authCredentialsDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await this.hashPassword(password, salt);

        const user = new User();

        user.username = username;
        user.password = hashedPassword;
        user.salt = salt;

        try {
            await user.save();
        } catch (e) {
            if(e.code === Errors.ER_DUP_ENTRY) {
                throw new ConflictException("Username already exists");
            } else {
                throw e;
            }
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const {
            username,
            password
        } = authCredentialsDto;

        const user = await this.findOne({username});

        if(user && await user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }
    }
}
