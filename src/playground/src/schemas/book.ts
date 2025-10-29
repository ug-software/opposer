import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from "typeorm";
import { Field, f } from "opposer";
import Author from "./author.js";

@Entity("book")
export default class Book {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar" })
	@Field(() => f().string("O campos é do tipo string").required("Campo de preenchimento obrigatorio"))
	name!: string;

	@Column({ type: "date" })
	@Field(() => f().date("O campo é necessáriamente uma data").required("Campo de preenchimento obrigatorio"))
	published!: Date;

	@Column({ type: "varchar" })
	@Field(() => f().string("O campos é do tipo string"))
	description!: string;
	
	@ManyToOne(() => Author, (author) => author.books)
	author!: Author;
}