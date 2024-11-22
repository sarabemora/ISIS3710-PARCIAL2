import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoService } from './medico.service';
import { MedicoEntity } from './medico.entity';
import { MedicoController } from './medico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MedicoEntity])],
  providers: [MedicoService],
  exports: [MedicoService],
  controllers: [MedicoController],
})
export class MedicoModule {}
