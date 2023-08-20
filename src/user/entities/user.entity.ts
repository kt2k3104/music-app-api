import { Song } from 'src/song/entities/song.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Column()
  password: string

  @Column()
  email: string

  @Column({ nullable: true, default: null })
  refresh_token: string

  @Column({ nullable: true, default: null })
  avatar: string

  @Column({ default: 1 })
  status: number

  @CreateDateColumn()
  created_at: Date

  @CreateDateColumn()
  updated_at: Date

  @OneToMany(() => Song, song => song.user)
  songs: Song[]

  @ManyToMany(() => Song)
  @JoinTable()
  favoriteSongs: Song[]
}
