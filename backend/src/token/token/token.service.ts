import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {v4 as uuidv4} from 'uuid';

import {Poll} from '../../schema';

@Injectable()
export class TokenService {
    constructor(@InjectModel(Poll.name) private pollModel: Model<Poll>) {
    }

    generateToken(): any {
        return {token: uuidv4()};
    }

    async regenerateToken(token: string): Promise<any> {
        const newToken = uuidv4();
        await this.pollModel.updateMany({adminToken: token}, {adminToken: newToken}).exec();
        return {token: newToken};
    }
}
