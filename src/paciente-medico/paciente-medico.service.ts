import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicoEntity } from 'src/medico/medico.entity';
import { PacienteEntity } from 'src/paciente/paciente.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PacienteMedicoService {
    constructor(
        @InjectRepository(PacienteEntity)
        private readonly pacienteRepository: Repository<PacienteEntity>,

        @InjectRepository(MedicoEntity)
        private readonly medicoRepository: Repository<MedicoEntity>,
    ) {}

    async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<PacienteEntity> {
        const medico: MedicoEntity = await this.medicoRepository.findOne({where: {id: medicoId}});
        if (!medico) {
            throw new BusinessLogicException('Médico no encontrado', BusinessError.NOT_FOUND);
        }

        const paciente: PacienteEntity = await this.pacienteRepository.findOne({where: {id: pacienteId}, relations: ['medicos', 'diagnosticos']});
        if (!paciente) {
            throw new BusinessLogicException('Paciente no encontrado', BusinessError.NOT_FOUND);
        }

        if (paciente.medicos.length >= 5) {
            throw new BusinessLogicException('El paciente no puede tener más de 5 médicos asignados', BusinessError.BAD_REQUEST);
        }

        paciente.medicos = [...paciente.medicos, medico];
        return await this.pacienteRepository.save(paciente);
    }
}
