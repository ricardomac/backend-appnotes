import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { BackofficeModule } from './modules/backoffice/backoffice.module';

@Module({
  imports: [TypeOrmModule.forRoot(), BackofficeModule],
})
export class AppModule {}
