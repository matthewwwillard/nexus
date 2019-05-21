import {
    Column, CreateDateColumn, PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumnOptions,
    JoinColumn, OneToMany, BaseEntity
} from "typeorm";
import {Users} from "./Users";

@Entity()
export class ActivityTracker extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:true})
    email:string;
    
    @Column({nullable:true})
    browser:string;

    @Column({nullable:true})
    ip:string;

    @Column({nullable:true})
    returnStatus:number;

    @Column({nullable:true})
    requestType:string;

    @Column({nullable:true})
    requestEndPoint:string;

    @Column('text',{nullable:true})
    payload:string;

    @ManyToOne(type=>Users)
    @JoinColumn()
    user:Users;
    
    @CreateDateColumn()
    requested:string;
}