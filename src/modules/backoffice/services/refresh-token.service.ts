import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { RefreshToken } from "../models/refresh-token.entity"
import { UserEntity } from "../models/user.entity"

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) { }

  public async createRefreshToken(user: UserEntity, ttl: number): Promise<RefreshToken> {
    const token = new RefreshToken()

    token.user = user
    token.is_revoked = false

    const expiration = new Date()
    
    console.log(ttl);

    expiration.setTime(expiration.getTime() + ttl)

    token.expires = expiration

    console.log(expiration);

    return await this.refreshTokenRepository.save(token);
  }

  public async findTokenById(id: number): Promise<RefreshToken | null> {
    return await this.refreshTokenRepository.findOne({
      where: { id }
    })
  }
}