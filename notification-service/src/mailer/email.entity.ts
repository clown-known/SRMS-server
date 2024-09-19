// import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// @Entity('emails')
// export class Email {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column({ type: 'varchar', length: 255 })
//     from: string;

//     @Column({ type: 'text' })
//     recipients: string;

//     @Column({ type: 'varchar', length: 255 })
//     subject: string;

//     @Column('json') 
//     context: any;

//     @Column({ type: 'text', nullable: true })
//     text?: string;

//     @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//     sentAt: Date;
// }
