import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Collaborator, CollaboratorSchema } from 'src/schemas/collaborator.schema'
import { CollaboratorsService } from './collaborators.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Collaborator.name, schema: CollaboratorSchema }])],
  providers: [CollaboratorsService],
  controllers: [],
})
export class CollaboratorsModule {}
