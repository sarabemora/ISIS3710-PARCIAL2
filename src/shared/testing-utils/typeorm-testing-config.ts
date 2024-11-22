/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticoEntity } from 'src/diagnostico/diagnostico.entity';
import { MedicoEntity } from 'src/medico/medico.entity';
import { PacienteEntity } from 'src/paciente/paciente.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [PacienteEntity, MedicoEntity, DiagnosticoEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([PacienteEntity, MedicoEntity, DiagnosticoEntity]),
];
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/