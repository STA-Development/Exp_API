import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn ,BeforeInsert} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column( {unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: 60000 })
  salary: number;

  @Column({ default: "https://www.w3schools.com/howto/img_avatar.png"})
  avatar: string;

  @Column({ default: null})
  avatar_public_id: string;




}
