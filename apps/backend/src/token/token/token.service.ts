import {Participant, Poll} from '@apollusia/types';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

@Injectable()
export class TokenService {
    constructor(
        @InjectModel(Poll.name) private pollModel: Model<Poll>,
        @InjectModel(Participant.name) private participantModel: Model<Participant>,
    ) {
    }

    generateToken(): any {
        return {token: crypto.randomUUID()};
    }

    async regenerateToken(token: string): Promise<any> {
        const newToken = crypto.randomUUID();
        await this.pollModel.updateMany({adminToken: token}, {adminToken: newToken}).exec();
        await this.participantModel.updateMany({token}, {token: newToken}).exec();
        return {token: newToken};
    }
}
