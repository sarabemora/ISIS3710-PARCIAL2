/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PacienteEntity } from './paciente.entity';

@Injectable()
export class PacienteService {
    constructor (
        @InjectRepository(PacienteEntity)
        private readonly pacienteRepository: Repository<PacienteEntity>
    ) {}

    async create(paciente: PacienteEntity): Promise<PacienteEntity> {
        if (!paciente.nombre || paciente.nombre.length < 3) {
            throw new BusinessLogicException('El nombre no puede tener menos de 3 caracteres', BusinessError.BAD_REQUEST);
        }
        return await this.pacienteRepository.save(paciente);
    }

    async findOne(id: string): Promise<PacienteEntity> {
        const paciente: PacienteEntity = await this.pacienteRepository.findOne({where: {id}});
        if (!paciente) {
            throw new BusinessLogicException('Paciente no encontrado', BusinessError.NOT_FOUND);
        }
        return paciente;
    }

    async findAll(): Promise<PacienteEntity[]> {
        return await this.pacienteRepository.find({relations: ['medicos', 'diagnosticos']});
    }

    async delete(id: string) {
        const paciente: PacienteEntity = await this.pacienteRepository.findOne({where: {id}, relations: ['medicos', 'diagnosticos']});
        if (!paciente) {
            throw new BusinessLogicException('Paciente no encontrado', BusinessError.NOT_FOUND);
        }
        if (paciente.diagnosticos && paciente.diagnosticos.length > 0) {
            throw new BusinessLogicException('No se puede eliminar un paciente con diagnósticos asociados', BusinessError.BAD_REQUEST);
        }
        await this.pacienteRepository.remove(paciente);
    }
}
