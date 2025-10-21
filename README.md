# Opposer

Opposer é um ecosistema gerenciador em formato de api, para gestão de dados, criação de metodos capazes de tranformar dados em formato Reducer. Desenvolvido para ser rápido em solucionar o acesso e manutenção de dados, seja em inserção, deleção, consulta, páginado ou não ao banco.

Atualmente suporta somente Postgress, porém em próximas versões estará disponivel em outros bancos de dados.

#### Para começar é necessário instalar 
1. Opposer:
		`` npm install git+https://github.com/ug-software/opposer.git#latest ``
	
2. Typescript:
		`` npm install typescript ``

3. Typeorm:
		``npm install typeorm `` 



#### Vamos criar um gerenciador de livros, com duas entidades, Livros e Autores.

Só é possivel para o opposer gerênciar de forma fácil a criação do servidor por causa de sua organização, ele necessáriamente é feito para mapeamento por pastas então criaremos dentro do `` /src `` duas pastas a ``` /schemas ``` onde estará nossas entidades e validações e ``` /reducers ``` onde estará nossas classes com ações customizadas ou serviços necessários dentro da api, no final nossa estrutura de pastas estará desta forma:
	
		project/
		├── src/
		│   ├── schemas/     # Entidades de Schemas de validações.
		│   ├── reducers/    # Reducers responsaveis por customizações.
		|   └── index.ts     # Nossa porta de entrada para o Servidor.
		├── opposer-settings.json
		├── tsconfig.json
		└── package.json
 

Vamos criar nossos Schemas, eles são declarados com decorators então é necessário que em seu `` tsconfig.json `` esteja com as frags `` "emitDecoratorMetadata": true `` e `` "experimentalDecorators": true ``;

Para o schema de Autor teremos em `` src/schemas/author.ts `` o seguinte código:

		import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
		import { f, Field } from "opposer";
		import Book from "./book";

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
			books: Book[];
		}


E em ``src/schemas/book.ts`` teremos:

		import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from "typeorm";
		import { Field, f } from "opposer";
		import Author from "./author";

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

Reparemos que nestes arquivos a um misto de Typeorm e Opposer, onde o Orm declara sua entidade e relacionamento entre as tabelas, como as colunas generatinas como o id, e o Opposer será responsavel por validar esse schema com o decorator Field fazendo o objeto de validação, um exemplo do objeto final é muito parecido com isso:

		import { Field, f } from  "opposer";
		
		const book = {
			name: f().string("O campos é do tipo string").required("Campo de preenchimento obrigatorio")
			published: f().date("O campo é necessáriamente uma data").required("Campo de preenchimento obrigatorio")
			description: f().string("Campo é do tipo string")
		}

A outros métodos possiveis na validação de cada campo, como ``match`` para regex, ``min`` e ``max`` para números ou ``case`` para validação contestual, onde há todos os valores atuais e é possivel validar caso algum campo esteja preenchido ou não. A mais sobre as validações sessões para baixo.

Certo com nossas entidades e schemas criados vamos para instânciar o servidor, onde a mágica realmente acontece.

No nosso ``src/index.ts`` precisaremos de algo parecido com isto aqui:

		import { Server } from  "opposer";
		
		(async () => {
			var opposer = Server({
				port: 3838, // porta do servidor...
				cors: {
					origin: "*", // customização do cors (* neste caso aberto para qualquer endereço ou regra.)
				},
			});
			
			(await opposer).initialize();
		})();

Há também a configuração do nosso arquivo matriz o ``opposer-settings.json ``é nele que conseguiremos configurar algumas propriedades bem interessantes sobre nosso serviço, então em ``project/opposer-settings.json`` teremos um exemplo minimo dele algo parecido com isso:

		{
			"database": {
				"type": "postgres",
				"host": "localhost",
				"port": 5432,
				"username": "opposer",
				"password": "opposer",
				"database": "opposer",
				"synchronize": true,
				"logging": true
			}
		}

Como havia comentado, neste momento o Opposer tem a possibilidade de utilizar somente Postgress e é neste lugar que colocaremos nossa configuração, é possivel também deixar no ``env``, caso ele não ache aqui, ele buscará lá, as configurações são as mesmas do Typeorm então neste momento caso sua configuração não bata com esse exemplo, você pode consultar a própria documentação do [Typeorm](https://typeorm.io/docs). 

Feito isto podemos para desenvolvimento rodar o comando `` npx tsx ./src/index.ts ``, ele inicializará o servidor e você verá `` ⚡ Opposer is running in port 3838 ``. Pronto temos nosso serviço no ar e poderemos acessar fazendo requisições em `` /opposer ``. Já podemos inserir, deletar, buscar ou atualizar nossos autores e livros;

Dito isto vamos para a segunda parte do nosso exemplo básico. O Opposer foi projetado para fácilitar o desenvolvimento do back-end, do gerênciamento dos dados, suas consultas são a base para flexibilidade ao obter os dados e robustes para inserir podendo usar relacionamentos, arrays, jsons dados validos graças ao Typeorm***. Todos os métodos são ``post`` e precisam da chave de api ( descreverei mais a frente no tópico de segurança ). Para obter os dados dos autores, queremos uma lista com todos sem filtro algum, poderemos obter da segunte forma:

		(async () => {
			const  authors = await fetch("http://localhost:3838/opposer", {
				method: "POST",
				body: JSON.stringify({
					method: "get",
					schema: "author",
					query: {
						type: "filter",
						filter: {},
					},
				}),
			});

			console.log(await  authors.json())
		})();

O nosso retorno será:

		[
			{
				"id": "1cace75e-abc7-483d-9a98-cf95a4962997",
				"firstName": "Carl",
				"lastName": "Sagan",
				"age": 62,
				"address": {
					"street": "SN",
					"number": 0
				}
			},
			{
				"id": "553e4098-b6dd-4889-bb3a-b234396c82a6",
				"firstName": "Joaquim Maria",
				"lastName": "Machado de Assis",
				"age": 69,
				"address": {
					"street": "SN",
					"number": 0
				}
			}
		]

Se quisermos pegar os livros de cada autor junto com eles ?, conseguimos também basta passar o seu relacionamento na consulta, desta forma:

		(async () => {
			const  authors = await fetch("http://localhost:3838/opposer", {
				method: "POST",
				body: JSON.stringify({
					method: "get",
					schema: "author",
					query: {
						type: "filter",
						filter: {},
						relations: ["books"]
					},
				}),
			});

			console.log(await  authors.json())
		})();

E o nosso retorno trará os livros juntos com cada autor, a também possibilidade de buscar os livros e então seus autores ( uma busca reversa ). Podemos buscar de forma páginada, buscar somente um com ``find``, os métodos nesta parte cridas foram inspiradas no ``javascript`` com suas funções de consulta por array, então pode ser que por agora não tenha uma forma de chegar de forma tão granulada ao dado, mas nas próximas releases existira, consulte na sessão de consulta os outros parametros que podemos utilizar na consulta.