import { Controller } from '@nestjs/common'
import { SavesService } from './saves.service'

@Controller('save')
export class SavesController {
  constructor(private readonly savesService: SavesService) {}
}
