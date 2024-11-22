/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { MedicoEntity } from './medico.entity';

@Injectable()
export class MedicoService {
    constructor (
        @InjectRepository(MedicoEntity)
        private readonly medicoRepository: Repository<MedicoEntity>
    ) {}

    async create(medico: MedicoEntity): Promise<MedicoEntity> {
        if (!medico.nombre || medico.nombre.trim().length === 0) {
            throw new BusinessLogicException('El nombre no puede estar vacío', BusinessError.BAD_REQUEST);
        }
        if (!medico.especialidad || medico.especialidad.trim().length === 0) {
            throw new BusinessLogicException('La especialidad no puede estar vacía', BusinessError.BAD_REQUEST);
        }
        return await this.medicoRepository.save(medico);
    }

    async findOne(id: string): Promise<MedicoEntity> {
        const medico: MedicoEntity = await this.medicoRepository.findOne({where: {id}});
        if (!medico) {
            throw new BusinessLogicException('Médico no encontrado', BusinessError.NOT_FOUND);
        }
        return medico;
    }

    async findAll(): Promise<MedicoEntity[]> {
        return await this.medicoRepository.find({relations: ['pacientes']});
    }

    async delete(id: string) {
        const medico: MedicoEntity = await this.medicoRepository.findOne({where: {id}, relations: ['pacientes']});
        if (!medico) {
            throw new BusinessLogicException('Médico no encontrado', BusinessError.NOT_FOUND);
        }
        if (medico.pacientes && medico.pacientes.length > 0) {
            throw new BusinessLogicException('No se puede eliminar un médico con pacientes asociados', BusinessError.BAD_REQUEST);
        }
        await this.medicoRepository.remove(medico);
    }
}
