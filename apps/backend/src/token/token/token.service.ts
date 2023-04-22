import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {v4 as uuidv4} from 'uuid';

import {Participant, Poll} from '@apollusia/types';

@Injectable()
export class TokenService {
    constructor(
        @InjectModel(Poll.name) private pollModel: Model<Poll>,
        @InjectModel(Participant.name) private participantModel: Model<Participant>,
    ) {
    }

    generateToken(): any {
        return {token: uuidv4()};
    }

    async regenerateToken(token: string): Promise<any> {
        const newToken = uuidv4();
        await this.pollModel.updateMany({adminToken: token}, {adminToken: newToken}).exec();
        await this.participantModel.updateMany({token}, {token: newToken}).exec();
        return {token: newToken};
    }
}
