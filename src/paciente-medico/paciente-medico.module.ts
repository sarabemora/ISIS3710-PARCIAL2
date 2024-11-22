import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from '../paciente/paciente.entity';
import { PacienteService } from '../paciente/paciente.service';
import { MedicoEntity } from '../medico/medico.entity';
import { PacienteMedicoController } from './paciente-medico.controller';

@Module({
    providers: [PacienteService],
    imports: [TypeOrmModule.forFeature([PacienteEntity, MedicoEntity])],
    controllers: [PacienteMedicoController],
  
})
export class PacienteMedicoModule {}
