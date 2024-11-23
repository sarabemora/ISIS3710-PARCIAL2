import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from '../paciente/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity';
import { PacienteMedicoController } from './paciente-medico.controller';
import { PacienteMedicoService } from './paciente-medico.service';

@Module({
    providers: [PacienteMedicoService],
    imports: [TypeOrmModule.forFeature([PacienteEntity, MedicoEntity])],
    controllers: [PacienteMedicoController],
  
})
export class PacienteMedicoModule {}
