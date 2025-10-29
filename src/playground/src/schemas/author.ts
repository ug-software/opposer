import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { f, Field } from "opposer";
import Book from "./book.js";

@Entity("author")
export default class Author {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar" })
	@Field(() => f().string("O campos é do tipo string").required("O campo é de preenchimento obrigatório"))
	firstName!: string;

	@Column({ type: "varchar" })
	@Field(() => f().string("O campos é do tipo string").required("O campo é de preenchimento obrigatório"))
	lastName!: string;

	@Column({ type: "varchar" })
	@Field(() =>  f().number("O campo é do tipo numérico").required("O campo é de preenchimento obrigatório"))
	age!: number;

	@Column({ type: "jsonb" })
	@Field(() =>
		f().json({
			number: f().number("O campo é do tipo numérico"),
			street: f().string("O campos é do tipo string"),
		})
	)
	address!: {
		number: number;
		street: string;
	};

	@OneToMany(() => Book, (book) => book.author)
	books!: Book[];
}