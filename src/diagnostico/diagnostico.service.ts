/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { DiagnosticoEntity } from './diagnostico.entity';

@Injectable()
export class DiagnosticoService {
    constructor (
        @InjectRepository(DiagnosticoEntity)
        private readonly diagnosticoRepository: Repository<DiagnosticoEntity>
    ) {}

    async create(diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
        if (diagnostico.descripcion.length > 200) {
            throw new BusinessLogicException('La descripción no puede tener más de 200 caracteres', BusinessError.BAD_REQUEST);
        }
        return await this.diagnosticoRepository.save(diagnostico);
    }

    async findOne(id: string): Promise<DiagnosticoEntity> {
        const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({where: {id}});
        if (!diagnostico) {
            throw new BusinessLogicException('Diagnostico no encontrado', BusinessError.NOT_FOUND);
        }
        return diagnostico;
    }

    async findAll(): Promise<DiagnosticoEntity[]> {
        return await this.diagnosticoRepository.find({relations: ['paciente']});
    }

    async delete(id: string) {
        const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({where: {id}});
        if (!diagnostico) {
            throw new BusinessLogicException('Diagnostico no encontrado', BusinessError.NOT_FOUND);
        }
        await this.diagnosticoRepository.remove(diagnostico);
    }

}
