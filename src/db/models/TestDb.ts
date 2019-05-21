import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class TestDb
{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;
}