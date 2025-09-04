import { Module } from '@nestjs/common';
import { TranslateController } from './translate/translate.controller';
import { TranslateModule } from './translate/translate.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [TranslateModule,
    ThrottlerModule.forRoot([{
          ttl: 60000, // 60 seconds
          limit: 3,  // 10 requests
        }]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
