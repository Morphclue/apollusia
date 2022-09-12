import {Controller, Get, Param} from '@nestjs/common';

import {TokenService} from './token.service';

@Controller('token')
export class TokenController {
    constructor(private readonly tokenService: TokenService) {
    }

    @Get()
    generateToken(): any {
        return this.tokenService.generateToken();
    }

    @Get(':token')
    async regenerateToken(@Param('token') token: string): Promise<any> {
        return this.tokenService.regenerateToken(token);
    }
}
