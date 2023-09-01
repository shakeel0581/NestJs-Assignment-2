import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login-auth.dto';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }

    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      throw new HttpException('Invalid credentials', 400);
    }

    const toeknData = await this.getTokens(user);
    return { ...toeknData, name: user.email };
  }

  private async getTokens(user) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.email,
          id: user.id,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION',
          ),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.email,
          id: user.id,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION',
          ),
        },
      ),
    ]);
    const accessExpiry = JSON.parse(atob(accessToken.split('.')[1])).exp;
    const refreshExpiry = JSON.parse(atob(refreshToken.split('.')[1])).exp;

    return {
      accessTokenExpiry: accessExpiry * 1000,
      refreshTokenExpiry: refreshExpiry * 1000,
      accessTokenExpiryInTime: new Date(accessExpiry * 1000),
      refreshTokenExpiryInTime: new Date(refreshExpiry * 1000),
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(token: string) {
    try {
      const { sub: email } = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      const user = await this.userRepository.findOneOrFail({
        where: { email },
      });
      const results = await this.getTokens(user);
      delete results.refreshToken;
      delete results.refreshTokenExpiry;
      delete results.accessTokenExpiryInTime;
      delete results.refreshTokenExpiryInTime;
      return results;
    } catch (err) {
      throw new HttpException('Invalid credentials', 400);
    }
  }
}
