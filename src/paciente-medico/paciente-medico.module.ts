import { Module } from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from 'src/paciente/paciente.entity';
import { PacienteService } from 'src/paciente/paciente.service';
import { MedicoEntity } from 'src/medico/medico.entity';

@Module({
    providers: [PacienteService],
    imports: [TypeOrmModule.forFeature([PacienteEntity, MedicoEntity])],
  
})
export class PacienteMedicoModule {}
