import { PacienteEntity } from "../paciente/paciente.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class DiagnosticoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @ManyToOne(() => PacienteEntity, paciente => paciente.diagnosticos)
    paciente: PacienteEntity;
}
