import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common'
import { AccessService } from './access.service'
import { ProvideAccessDto } from './dto/provide.dto'
import { JwtAuthGuard } from 'src/auth/auth.guard'

@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async provideAccess(@Body() body: ProvideAccessDto) {
    await this.accessService.provide(body)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeAccess(@Param() { id }: { id: string }) {
    await this.accessService.remove(id)
  }
}
