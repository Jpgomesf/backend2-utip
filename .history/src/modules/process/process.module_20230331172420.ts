import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ProcessService } from './process.service'
import { Process, ProcessSchema } from './schema/process.schema'
import { ProcessController } from './process.controller'

@Module({
  imports: [ 
    MongooseModule.forFeature([{ name: Process.name, schema: ProcessSchema }]),
  ],
  controllers: [ProcessController],
  providers: [ProcessService],
})
export class ProcessModule {}