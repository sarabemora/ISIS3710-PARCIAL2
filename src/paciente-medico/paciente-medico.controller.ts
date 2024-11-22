import { Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { PacienteMedicoService } from './paciente-medico.service';

@Controller('paciente')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteMedicoController {
    constructor(private readonly pacienteMedicoService: PacienteMedicoService) {}

    @Post(':pacienteId/medico/:medicoId')
    async addMedicoToPaciente(@Param('pacienteId') pacienteId: string, @Param('medicoId') medicoId: string) {
        return await this.pacienteMedicoService.addMedicoToPaciente(pacienteId, medicoId);
    }
}
