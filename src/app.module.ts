import { Module } from '@nestjs/common';
import { ApisModule } from 'src/apis/apis.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), ApisModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
