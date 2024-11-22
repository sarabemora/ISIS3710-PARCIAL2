import { Controller } from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';

@Controller('diagnostico')
export class DiagnosticoController {
    constructor(private readonly diagnosticoService: DiagnosticoService) {}
}
