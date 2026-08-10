# Opposer

Opposer é um ecossistema modular para construção de aplicações modernas, focado em alta produtividade e organização por Domínios. Ele unifica Servidor HTTP, Agendamento de Tarefas, ORM e Persistência de Estado em uma única ferramenta extensível e altamente performática.

---

## Começando

Inicie um novo projeto Opposer em segundos utilizando o CLI.

### 1. Instalação
No diretório do seu projeto, instale o pacote principal:
```bash
npm install @ug.software/opposer
```

### 2. Inicialização (Scaffold)
Rode o comando de inicialização para criar as pastas, arquivos de exemplo e configurações padrões:
```bash
npx @ug.software/opposer init
```

### Estrutura de Domínios Gerada
O Opposer organiza a lógica da sua aplicação em pastas específicas que ele mapeia automaticamente. Esta arquitetura facilita a escalabilidade e a manutenção:

```text
project/
├── src/
│   ├── controllers/ # Ações da API e Endpoints (Lógica de Servidor)
│   ├── models/      # Entidades do Banco de Dados e Validações (ORM)
│   ├── schedules/   # Tarefas Agendadas e Background Jobs (Cron)
│   └── index.ts     # Ponto de entrada e Inicialização do Servidor
├── opposer-settings.json # Configurações estáticas (Porta, URL, DB Type)
├── .env                 # Variáveis de ambiente sensíveis (Senhas, Keys)
└── package.json
```

### 3. Execução
O comando init configura automaticamente os scripts essenciais no seu package.json:

- Desenvolvimento: npm run dev (Inicia o servidor com hot-reload via tsx)
- Produção (Build): npm run build (Gera o bundle otimizado em dist/index.js)

---

## 1. Controller (Servidor HTTP)

O motor de servidor do Opposer utiliza le conceito de Controllers. Cada Controller agrupa ações relacionadas a um domínio específico. Através de Decorators, você define rotas, validações e comportamentos de segurança de forma declarativa.

### Configuração do Servidor
| Variável de Ambiente | Descrição | Padrão |
| :--- | :--- | :--- |
| OPPOSER_PORT | Porta onde o servidor HTTP irá rodar. | 3838 |
| OPPOSER_URL | Caminho base para as requisições POST. | /opposer |

### Configuração de CORS
O Opposer permite configurar o compartilhamento de recursos entre origens de forma detalhada.

| Propriedade | Tipo | Descrição |
| :--- | :--- | :--- |
| origin | string \| string[] | Origens permitidas (Ex: "*", "http://localhost:3000"). |
| credentials | boolean | Habilita o envio de cookies/auth nas requisições (Padrão: true). |
| methods | string[] | Métodos HTTP permitidos (Padrão: GET, POST, PUT, DELETE, OPTIONS). |
| allowedHeaders | string[] | Cabeçalhos permitidos (Padrão: Content-Type, Accept, Authorization, opposer-key, x-opposer-transport). |

### Transportes JSON e stream

O servidor aceita os transportes `json` e `stream` por padrão. Ambos usam a mesma URL, payload, schemas, autenticação e permissões; o cabeçalho da requisição define apenas como a resposta será entregue.

```typescript
const app = await Server({
  models: "./src/models",
  controllers: "./src/controllers",
  transports: ["json", "stream"]
});
```

Para restringir a API, informe somente `["json"]` ou `["stream"]`. Com os dois habilitados, uma requisição sem negociação explícita continua usando JSON REST.

A mesma opção pode ser declarada em `opposer-settings.json` como `"transports": ["json", "stream"]`; a opção passada para `Server` tem prioridade.

#### REST/JSON

```typescript
const response = await fetch("https://api.exemplo.com/opposer", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ model: "Book", method: "get", query: {} })
});

const books = await response.json();
```

#### Stream NDJSON em uma SPA

Solicite `application/x-ndjson`. Cada linha recebida é um JSON completo: respostas em lista geram um evento `data` por item e terminam com um evento `end`. Erros HTTP são enviados como evento `error` antes de `end`.

```typescript
const response = await fetch("https://api.exemplo.com/opposer", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/x-ndjson",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({ model: "Book", method: "get", query: {} })
});

if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);

const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
let pending = "";

while (true) {
  const { value = "", done } = await reader.read();
  pending += value;
  const lines = pending.split("\n");
  pending = lines.pop() ?? "";

  for (const line of lines) {
    if (!line) continue;
    const message = JSON.parse(line);
    if (message.event === "data") console.log(message.data);
    if (message.event === "error") console.error(message.data);
  }

  if (done) break;
}
```

Como alternativa ao `Accept`, use `x-opposer-transport: stream`. Se CORS tiver `allowedHeaders` customizado, inclua `Accept` e `x-opposer-transport` nessa lista.

Streaming reduz a necessidade de manter toda a resposta em memória e permite processar itens assim que chegam, mas não cifra os dados por si só. Para proteger a transferência em produção, use sempre HTTPS/TLS, autenticação e uma política CORS restrita.

### Componentes do Servidor
Todos os componentes abaixo podem ser importados de "@ug.software/opposer/server".

| Componente | Tipo | Descrição |
| :--- | :--- | :--- |
| @Controller(name) | Class Decorator | Identifica a classe como um domínio de ações. |
| @Method() | Method Decorator | Expõe um método como uma ação executável pela API. |
| @Payload(Dto) | Parameter Decorator | Injeta e valida os dados da requisição. |
| @IsPublicMethod() | Method Decorator | Ignora a autenticação apenas para este método. |
| Success(data) | Helper Function | Retorno padrão para sucesso. |
| Exception(config) | Helper Function | Retorno padrão para erros estruturados. |

### Exemplo de Controller (src/controllers/user.ts)
```typescript
import { Controller, Method, Payload, Success, IsPublicMethod, f, Field } from "@ug.software/opposer/server";

// 1. Definição do DTO para Validação
class CreateUserDto {
    @Field(() => f().string().required().min(3))
    name!: string;
    
    @Field(() => f().string().required().email())
    email!: string;
}

@Controller("users")
export default class UserController {
    
    // Método Protegido (Requer Auth se habilitado globalmente)
    @Method()
    async create(@Payload(CreateUserDto) payload: any) {
        const newUser = payload.data;
        return Success({ id: "123", ...newUser });
    }

    // Método Público (Acessível sem Token/Auth)
    @IsPublicMethod()
    @Method()
    async list() {
        return Success([{ id: "1", name: "Admin" }]);
    }
}
```

### Resiliência e Tratamento de Erros (Padrão Either)
Os helpers Success e Exception seguem o conceito de Either Result. O servidor não deve disparar throw error para falhas previstas (negócio/validação), garantindo um ciclo de vida previsível e seguro.

---

## 2. Schedule (Automação de Tarefas)

O módulo de Schedule permite automatizar processos com controle total de execução e persistência de histórico.

### Componentes de Agendamento
Importe de "@ug.software/opposer/schedule".

| Componente | Parâmetro | Descrição |
| :--- | :--- | :--- |
| @Schedule(config) | name: string | Nome único da tarefa. |
| | interval: string | Intervalo (Ex: "1m", "1h", "30s"). |
| | description? | Texto para o Playground. |

### Exemplo de Tarefa Agendada (src/schedules/cleanup.ts)
```typescript
import { Schedule } from "@ug.software/opposer/schedule";

export default class MaintenanceTask {
    @Schedule({ 
        name: "limpeza-logs", 
        interval: "24h",
        description: "Remove logs antigos do banco de dados diariamente"
    })
    async run() {
        // Lógica de manutenção...
        console.log("Rotina de limpeza executada.");
    }
}
```

---

## 3. ORM (Gestão de Dados)

O ORM do @ug.software/opposer gerencia a persistência de dados com uma abordagem Code-First.

### Configuração do Banco de Dados
| Variável de Ambiente | Descrição | Necessário |
| :--- | :--- | :--- |
| OPPOSER_DATABASE_TYPE | postgres, mysql ou sqlite. | Sim |
| OPPOSER_DATABASE_NAME | Nome do banco ou caminho (se sqlite). | Sim |
| OPPOSER_DATABASE_HOST | Endereço do servidor. | (exceto sqlite) |
| OPPOSER_DATABASE_USER | Usuário do banco. | (exceto sqlite) |
| OPPOSER_DATABASE_PASSWORD| Senha do banco. | (exceto sqlite) |
| OPPOSER_DATABASE_LOGGING | Habilita logs SQL (true/false). | Não |

### Componentes do ORM
Importe de "@ug.software/opposer/orm".

| Componente | Tipo | Descrição |
| :--- | :--- | :--- |
| @Entity(table, desc) | Class Decorator | Mapeia a classe para uma tabela. |
| @PrimaryColumn(opts)| Prop Decorator | Define a chave primária. |
| @Field(config) | Prop Decorator | Define coluna e regras de validação. |
| @Relation(opts) | Prop Decorator | Define relacionamentos (one-to-many, etc). |

### Exemplo de Model (src/models/product.ts)
```typescript
import { Entity, PrimaryColumn, Field, f, Relation } from "@ug.software/opposer/orm";
import Category from "./category";

@Entity("products", "Domínio de Produtos")
export default class Product {
    @PrimaryColumn({ type: "uuid" })
    id!: string;

    @Field(() => f().string().required().max(100))
    name!: string;

    @Field({ type: "number", default: 0 })
    price!: number;

    @Relation({ type: "many-to-one", target: () => Category, inverseSide: "products" })
    category!: Category;
}
```

### Query Builder O-API (JSON)
O Opposer permite realizar todas as operações de banco de dados enviando apenas JSON para o endpoint central.

#### Diferença entre Filter e Find
- **`filter`**: Retorna sempre uma **lista** (array) de objetos que satisfazem os critérios.
- **`find`**: Retorna apenas o **primeiro** objeto encontrado (objeto único) ou `null`.

#### Outros Tipos de Consulta
Além de buscar registros, você pode realizar operações de verificação e estatísticas.

**1. Contagem (`count`)**
Retorna a quantidade total de registros que batem com o filtro.
```json
{
    "method": "get",
    "model": "products",
    "query": {
        "type": "count",
        "count": { "price": { "$mt": 100 } }
    }
}
```

**2. Verificação de Existência (`exists`)**
Retorna um booleano (`true`/`false`) indicando se existe ao menos um registro.
```json
{
    "method": "get",
    "model": "products",
    "query": {
        "type": "exists",
        "exists": { "name": "Cerveja Artesanal" }
    }
}
```

**3. Valores Únicos (`distinct`)**
Retorna uma lista de valores únicos para um campo específico.
```json
{
    "method": "get",
    "model": "products",
    "query": {
        "type": "distinct",
        "distinct": { "field": "category" }
    }
}
```

**4. Agrupamento (`group`)**
Realiza agrupamentos complexos com agregações.
```json
{
    "method": "get",
    "model": "products",
    "query": {
        "type": "group",
        "group": {
            "by": ["category"],
            "aggregate": { "price": "avg", "id": "count" }
        }
    }
}
```

#### 1. Consulta Avançada (`get`)
Você pode combinar filtros, seleções, relacionamentos e paginação.

Exemplo: Filtragem Aninhada e Seleção de Campos
```json
{
    "method": "get",
    "model": "products",
    "query": {
        "type": "filter",
        "select": ["id", "name", "price"],
        "filter": { 
            "price": { "$mt": 10 },
            "category": { "active": true }
        },
        "relation": ["category"],
        "pagination": { "page": 0, "take": 10 }
    }
}
```

#### 2. Inserção de Dados (insert)
Cria um novo registro na tabela especificada.
```json
{
    "method": "insert",
    "model": "products",
    "data": {
        "name": "Teclado Mecânico",
        "price": 250.00,
        "category": "uuid-da-categoria"
    }
}
```

#### 3. Atualização de Dados (update)
Atualiza registros baseados em um filtro.
```json
{
    "method": "update",
    "model": "products",
    "filter": { "id": "uuid-do-produto" },
    "data": {
        "price": 220.00
    }
}
```

#### 4. Deleção de Dados (delete)
Remove registros baseados em um filtro.
```json
{
    "method": "delete",
    "model": "products",
    "filter": { "id": "uuid-do-produto" }
}
```

#### Operadores de Filtro
| Operador | SQL Equivalente | Descrição | Exemplo JSON |
| :--- | :--- | :--- | :--- |
| $eq | = | Igualdade (padrão se omitido) | "price": { "$eq": 100 } |
| $l | LIKE | Busca textual (case-sensitive) | "name": { "$l": "Cerveja%" } |
| $il | ILIKE | Busca textual (case-insensitive) | "name": { "$il": "%artesanal%" } |
| $lt | < | Menor que | "stock": { "$lt": 10 } |
| $lte | <= | Menor ou igual a | "stock": { "$lte": 5 } |
| $mt | > | Maior que | "price": { "$mt": 50 } |
| $mte | >= | Maior ou igual a | "price": { "$mte": 100 } |
| $in | IN | Valor contido na lista | "status": { "$in": ["A", "B"] } |
| $nin | NOT IN | Valor NÃO contido na lista | "id": { "$nin": ["uuid-1"] } |
| $btw | BETWEEN | Valor entre dois pontos | "createdAt": { "$btw": ["2023-01-01", "2023-12-31"] } |
| $or | OR | Lógica OU entre filtros | "$or": [{ "active": true }, { "priority": 1 }] |

#### Funcionamento de Relacionamentos
O Opposer resolve relacionamentos de forma flexível. Você pode carregar modelos inteiros ou apenas campos específicos, inclusive misturando as abordagens no mesmo array.

- String única: Ao passar apenas o nome da relação como string, o Opposer traz todos os campos desse modelo.
- Objeto de configuração: Permite selecionar campos específicos ou aninhamentos futuros.

Exemplo: Carga Mista de Relacionamentos
```json
{
    "method": "get",
    "model": "products",
    "query": {
        "filter": { "category.active": true },
        "relation": [
            "category",
            { "model": "user", "select": ["id", "name"] }
        ]
    }
}
```

---

#### Agregações e Métricas
Realize cálculos diretamente via JSON sem escrever código SQL.
```json
{
    "method": "get",
    "model": "products",
    "query": {
        "aggregate": {
            "where": { "stock": { "$mt": 0 } },
            "aggregate": { "price": "avg", "stock": "sum", "id": "count" }
        }
    }
}
```

---

## 4. Persistent (Estado e Cache Reativo)

Gerencie estados globais ou de sessão de forma transparente.

### Configuração de Snapshot
| Variável de Ambiente | Descrição | Padrão |
| :--- | :--- | :--- |
| OPPOSER_CACHE_SNAPSHOT | Habilita persistência em disco. | false |
| OPPOSER_CACHE_SNAPSHOT_TIMER| Intervalo entre backups. | 1 |
| OPPOSER_CACHE_SNAPSHOT_UNIT | Unidade (minutes, seconds). | minutes |

### Componentes de Persistência
Importe de "@ug.software/opposer/persistent".

| Componente | Escopo | Descrição |
| :--- | :--- | :--- |
| @Global() | Servidor | Compartilhado entre todos os usuários. |
| @Session() | Usuário | Isolado por sessão (Token/IP). |

### Exemplo de Persistência
```typescript
import { Global, Session } from "@ug.software/opposer/persistent";

export default class ConfigService {
    @Global() 
    maintenanceMode: boolean = false; // Compartilhado globalmente

    @Session() 
    theme: string = "dark"; // Individual por usuário
}
```

---

## 5. Segurança e Autenticação

O Opposer inclui um sistema de segurança completo e pronto para uso (Out-of-the-box), eliminando a necessidade de implementar fluxos manuais de login, registro ou gestão de sessões.

### Como Funciona
O sistema baseia-se em um fluxo de Duplo Token (Access + Refresh) para garantir máxima segurança e usabilidade:

1. Access Token: Token de curta duração usado para autorizar requisições.
2. Refresh Token: Token de longa duração usado exclusivamente para gerar novos Access Tokens sem deslogar o usuário.

### Onde enviar os Tokens
O Opposer é flexível e aceita tokens de duas formas principais:

- Navegador (Cookies): Ideal para aplicações web. Os tokens são gerenciados automaticamente via cookies httpOnly, prevenindo ataques XSS.
- API Externa (Bearer Header): Para integrações via mobile ou outros servidores, envie o Access Token no cabeçalho:
    Authorization: Bearer <seu-token-aqui>

### API Key (opposer-key)
Além da autenticação de usuário, o Opposer exige uma chave de aplicação para autorizar requisições externas que não venham do mesmo domínio do servidor (como integrações entre sistemas ou aplicativos mobile).

Onde enviar:
- Cabeçalho HTTP: opposer-key: <sua-api-key-gerada>
- Cookie: opposer_key

Sem esta chave, o middleware de autorização bloqueará a requisição antes mesmo de validar o Token JWT. Você pode gerar novas chaves através do Playground ou via CLI.

### Revalidação Automática (Silent Refresh)
Quando um Access Token expira, o middleware do Opposer verifica automaticamente a presença de um refresh_token válido nos cookies. Caso exista:
1. A sessão antiga é invalidada no banco de dados.
2. Um novo par de tokens é gerado e enviado de volta nos cookies da resposta.
3. A requisição original prossegue normalmente, sem que o usuário perceba a expiração.

### Configuração de Segurança
| Variável de Ambiente | Descrição | Necessário |
| :--- | :--- | :--- |
| OPPOSER_JWT_ACCESS | Chave secreta para o Access Token. | Sim (se auth=true) |
| OPPOSER_JWT_REFRESH | Chave secreta para o Refresh Token. | Sim (se auth=true) |
| OPPOSER_MANAGER_LOGIN | Login do administrador inicial. | Sim |
| OPPOSER_MANAGER_PASSWORD| Senha do administrador inicial. | Sim |

Nota: Ao ativar o sistema de auth, o Opposer injeta automaticamente o Controller Auth em sua API, expondo métodos como login, register, me e logout.


---

## 6. Contexto de Aplicação

Singleton central para acessar instâncias críticas de qualquer lugar do código.

Chaves Injetadas: db (Database), models (Entidades), controllers (Ações).

### Exemplo de Uso

1. Recuperando uma instância (Get):
```typescript
import { Context } from "@ug.software/opposer/server";
import { OpposerDatabase } from "@ug.software/opposer/orm";

// Recuperando o banco de dados dentro de um Helper ou Service
const db = Context.get<OpposerDatabase>("db");
```

2. Inserindo uma instância personalizada (Set):
Você pode usar o contexto para compartilhar seus próprios serviços ou instâncias globais.
```typescript
import { Context } from "@ug.software/opposer/server";

// Inserindo um serviço customizado durante a inicialização
Context.set("mailService", new MailService());

// Recuperando em qualquer outro lugar
const mailer = Context.get<MailService>("mailService");
```

---

## 7. Inicialização do Projeto

A função Server orquestra o carregamento de todos os domínios.

### Exemplo de Inicialização (src/index.ts)
```typescript
import { Server } from "@ug.software/opposer";

const app = await Server({
    models: "./src/models",
    controllers: "./src/controllers",
    schedules: "./src/schedules",
    scheduler: true,
    playground: false
});

app.initialize();
```

obs: na falta da declaração do path das models e controllers o opposer buscara a partir de seu arquivo a pasta models, controllers e schedules.

---

## 8. Playground (Dashboard de Desenvolvimento)

Interface visual nativa para exploração e gestão.
- Testes RPC: Dispare métodos dos Controllers em tempo real.
- Explorar Models: Veja o mapa de dados e relacionamentos.
- Segurança: Gestão de usuários e geração de API Keys.

Para manter a biblioteca base pequena, o Playground fica desabilitado por padrão. Habilite-o na configuração:

```typescript
const app = await Server({
  playground: true
});
```

Ao gerar uma distribuição que precisa incluir os assets React do Playground, use:

```bash
npm run build:playground
```

A build comum (`npm run build`) não instala nem copia esses assets. Depois de habilitado e compilado, o acesso é `http://localhost:3838/playground`.

### Builds modulares

- `npm run build`: compila o servidor, ORM, scheduler, persistência e transportes sem o frontend do Playground.
- `npm run build:playground`: gera a biblioteca e também compila/copia o frontend do Playground.
- Os arquivos de `src/examples` não fazem parte do pacote publicado.
- Drivers podem ser importados diretamente por `@ug.software/opposer/drivers/postgres`, `@ug.software/opposer/drivers/mysql` ou `@ug.software/opposer/drivers/sqlite`.

---

### CLI Helpers
- npx @ug.software/opposer init: Inicializa a estrutura base de um novo projeto.
- npx @ug.software/opposer build: Gera um bundle minificado em um único arquivo (dist/index.js).
- npx @ug.software/opposer generate:jwt-key: Gera um segredo seguro para JWT.
- npx @ug.software/opposer generate:api-key: Gera uma chave de acesso externa.
