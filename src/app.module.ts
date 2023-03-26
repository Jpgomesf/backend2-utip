import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProcessModule } from './process/process.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/uti-processual'), ProcessModule, AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
