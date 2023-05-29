import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from '../auth/auth.module'
import { ProcessModule } from '../process/process.module'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://jpgomesf:8tMfchBzh24mpcU@uti-processual.2xgklbr.mongodb.net/?retryWrites=true&w=majority'),
    ProcessModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
