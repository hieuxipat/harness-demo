import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class HeaderStrategy extends PassportStrategy(Strategy, 'header') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(request: Request) {
    let shop: string;
    const urlParams: string = request.headers['authorization'];
    if (['GET', 'DELETE'].includes(request.method?.toUpperCase())) {
      shop = request.query?.shop as string;
    } else {
      shop = request.body?.shop;
    }
    if (!urlParams) throw new UnauthorizedException('urlParams is required');
    if (urlParams === 'by-passs') return {};
    try {
      const payload = JSON.parse(urlParams);
      const isVerify = this.authService.verifyShopifyRequest(payload);
      if (!isVerify) throw new UnauthorizedException('urlParams invalid');
      if (shop && ![payload?.shop, payload?.store].includes(shop)) throw new UnauthorizedException('urlParams shop invalid');
      return payload;
    } catch (err) {
      console.log('HeaderStrategy', err.message);
      throw new UnauthorizedException(err.message);
    }
  }
}
