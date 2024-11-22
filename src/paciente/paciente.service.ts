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
        private readonly pacienteReporsitory: Repository<PacienteEntity>
    ) {}

    async create(paciente: PacienteEntity): Promise<PacienteEntity> {
        if (!paciente.nombre || paciente.nombre.trim().length === 0) {
            throw new BusinessLogicException('El nombre no puede estar vacío', BusinessError.BAD_REQUEST);
        }
        if (paciente.nombre.trim().length < 3) {
            throw new BusinessLogicException('El nombre no puede tener menos de 3 caracteres', BusinessError.BAD_REQUEST);
        }
        return await this.pacienteReporsitory.save(paciente);
    }

    async findOne(id: string): Promise<PacienteEntity> {
        const paciente: PacienteEntity = await this.pacienteReporsitory.findOne({where: {id}});
        if (!paciente) {
            throw new BusinessLogicException('Paciente no encontrado', BusinessError.NOT_FOUND);
        }
        return paciente;
    }

    async findAll(): Promise<PacienteEntity[]> {
        return await this.pacienteReporsitory.find({relations: ['medicos', 'diagnosticos']});
    }

    async delete(id: string) {
        const paciente: PacienteEntity = await this.pacienteReporsitory.findOne({where: {id}, relations: ['pacientes']});
        if (!paciente) {
            throw new BusinessLogicException('Paciente no encontrado', BusinessError.NOT_FOUND);
        }
        if (paciente.diagnosticos && paciente.diagnosticos.length > 0) {
            throw new BusinessLogicException('No se puede eliminar un paciente con diagnósticos asociados', BusinessError.BAD_REQUEST);
        }
        await this.pacienteReporsitory.remove(paciente);
    }
}
