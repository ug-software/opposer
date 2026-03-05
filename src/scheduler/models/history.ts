import {
  Entity,
  Field,
  PrimaryColumn,
  CreateDateColumn,
  f,
} from "../../orm/index.js";

@Entity("sh")
export default class ScheduleHistory {
  @PrimaryColumn({ type: "uuid" })
  id!: string;

  @Field(() => f().string("name is string.").required("name is required."))
  nm!: string; // Name of the schedule

  @Field(() => f().date("started at is date.").required("started at is required."))
  st!: Date; // Start time

  @Field(() => f().date("finished at is date."))
  ft?: Date; // Finish time

  @Field(() => f().boolean("success is boolean."))
  sc!: boolean; // Success status

  @Field(() => f().string("error is string."))
  er?: string; // Error message if failed

  @Field(() => f().number("duration is number."))
  du?: number; // Duration in milliseconds

  @CreateDateColumn()
  ct!: Date;
}
