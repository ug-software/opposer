import { Column, Entity } from "typeorm";

Entity("crp");
export default class ChangeRequestPassword {
  @Column({ type: "varchar" })
  lg!: string;

  @Column({ type: "varchar" })
  tk!: string;

  @Column({ type: "varchar" })
  ag!: string;

  @Column({ type: "varchar" })
  ip!: string;

  @Column({ type: "date", default: new Date() })
  ct!: Date;

  @Column({ type: "date", default: new Date() })
  et!: Date;

  @Column({ type: "boolean", default: false })
  ud!: boolean;
}

/*
  lg => user login;
  tk => forget token;
  ag => agent;
  ip => ip agent;
  ct => create at;
  et => expire at;
  ud => used;
*/
