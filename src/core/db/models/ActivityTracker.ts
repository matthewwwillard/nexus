import {
    Column, CreateDateColumn, PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumnOptions,
    JoinColumn, OneToMany
} from "typeorm";
import {AppTokens} from "./AppTokens";
import {Users} from "./Users";

@Entity()
export class ActivityTracker implements IActivityTracker
{
    @PrimaryGeneratedColumn()
    id:number;

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

    @ManyToOne(type=>AppTokens)
    @JoinColumn()
    appToken:AppTokens;

    @CreateDateColumn()
    requested:string;
}