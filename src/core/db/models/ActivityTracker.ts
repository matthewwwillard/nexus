import {Column, CreateDateColumn, PrimaryGeneratedColumn, Entity} from "typeorm";

@Entity()
export class ActivityTracker implements IActivityTracker
{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    browser:string;

    @Column()
    ip:string;

    @Column()
    returnStatus:number;

    @Column()
    requestType:string;

    @Column()
    requestEndPoint:string;

    @CreateDateColumn()
    requested:string;
}