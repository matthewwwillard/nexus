import {
    BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import * as moment from 'moment';

export enum DEVICE_TYPE{
    IOS='IOS',
    ANDROID='ANDROID'
}

@Entity()
export class Users extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    firstName:string;

    @Column()
    lastName:string;

    @Column()
    email:string;

    @Column({nullable:true})
    password:string;

    @Column({nullable:true})
    facebookAppUUID:string;
    
    @Column('text',{nullable:true})
    pushId:string;
    
    @Column({nullable:true})
    deviceType:DEVICE_TYPE;
    
    @Column({default:false})
    superUser:boolean;

    @Column('date', {default:moment().format('YYYY-MM-DD')})
    lastLogin:string;
    
    @Column({default:false})
    isDeleted:boolean;
    
    @Column({default:false})
    forcePasswordReset:boolean;

    @CreateDateColumn()
    created:string;

    @UpdateDateColumn()
    updated:string;

    public static findOneById(id:number)
    {
        return Users.findOne(id, {
            where:{
                isDeleted:false
            }
        });
    }

    public static async updateLoginTime(id:number)
    {
        await this.update({id:id}, {lastLogin:moment().format('YYYY-MM-DD')});
    }

}