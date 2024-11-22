import {IsNotEmpty, IsString} from 'class-validator';

export class DiagnosticoDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly genero: string;
}
