import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("se")
export default class Session {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  usr!: string;

  @Column({ type: "date", default: new Date() })
  loi!: Date;

  @Column({ type: "date", nullable: true })
  lou!: Date;

  @Column({ type: "boolean", default: true })
  ac!: boolean;

  @Column({ type: "varchar" })
  ip!: string;

  @Column({ type: "varchar" })
  ag!: string;

  @Column({ type: "varchar" })
  rt!: string;
}

/*
  usr => user id;
  loi => data de login;
  lou: => data de logout;
  ip => ip de login;
  ag => agente do browser;
  rt => refresh token;
*/
