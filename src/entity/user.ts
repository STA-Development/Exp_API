import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length: 100} )
    firstname: string;

    @Column({length: 100} )
    lastname: string;

    @Column({length: 100} )
    email: string;

}
