import { Injectable } from '@nestjs/common';
import { TranslateDto } from './dto/translate.dto';
import translate from 'google-translate-api-x';

@Injectable()
export class TranslateService {

    async translate(translateDto:TranslateDto){
        const response = await translate(translateDto.wordsToTranslate,{to: "pam"});
        return response.text;
    }

}
