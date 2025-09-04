import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { TranslateDto } from './dto/translate.dto';
import { languages } from 'google-translate-api-x';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('translate')
export class TranslateController {
    constructor(private readonly translateService:TranslateService){}

    @Post("/")
    @UseGuards(ThrottlerGuard)
    async translate(@Body() translateDto:TranslateDto){
        return await this.translateService.translate(translateDto);
    }
}
