import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { MedicoService } from './medico.service';
import { plainToInstance } from 'class-transformer';
import { MedicoEntity } from './medico.entity';
import { MedicoDto } from './medico.dto';

@Controller('medico')
@UseInterceptors(BusinessErrorsInterceptor)
export class MedicoController {
    constructor(private readonly medicoService: MedicoService) {}

    @Get()
    async findAll() {
        return await this.medicoService.findAll();
    }

    @Get(':medicoId')
    async findOne(@Param('medicoId') medicoId: string) {
        return await this.medicoService.findOne(medicoId);
    }

    @Post()
    async create(@Body() medicoDto: MedicoDto) {
        const medico: MedicoEntity = plainToInstance(MedicoEntity, medicoDto);
        return await this.medicoService.create(medico);
    }

    @Delete(':medicoId')
    @HttpCode(204)
    async delete(@Param('medicoId') medicoId: string) {
        return await this.medicoService.delete(medicoId);
    }
}
