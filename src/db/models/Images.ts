import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";


export enum EngineTypes {
    AWS='AWS',
    LOCAL='LOCAL'
}

@Entity()
export class Images extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:true})
    width:number;

    @Column('bigint')
    size:number;

    @Column({nullable:true})
    height:number;

    @Column()
    url:string;

    @Column({default:EngineTypes.LOCAL})
    engine:EngineTypes;

    @Column({default:false})
    isDeleted:boolean;

    @CreateDateColumn()
    created:string;

    @UpdateDateColumn()
    updated:string;

}