import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlackListRefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(BlackListRefreshToken)
    private readonly refreshTokenRepository: Repository<BlackListRefreshToken>,
  ) {}

  async addTokenToBlackList(token: string, expiresAt: Date) {
    const refreshToken = new BlackListRefreshToken();
    refreshToken.refreshToken = token;
    refreshToken.expiresAt = expiresAt;

    return await this.refreshTokenRepository.insert(refreshToken);
  }

  async checkIfTokenInBlackList(token: string) {
    const result = await this.refreshTokenRepository.find({
      where: { refreshToken: token },
    });

    return result.length !== 0;
  }
}
