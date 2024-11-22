import { MedicoEntity } from "../medico/medico.entity";
import { DiagnosticoEntity } from "../diagnostico/diagnostico.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PacienteEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;
    
    @Column()
    genero: string;

    @ManyToMany(() => MedicoEntity, medico => medico.pacientes)
    medicos: MedicoEntity[];

    @OneToMany(() => DiagnosticoEntity, diagnostico => diagnostico.paciente)
    diagnosticos: DiagnosticoEntity[];

}
