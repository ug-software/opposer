# Opposer

Opposer é um ecossistema modular para construção de aplicações modernas, focado em alta produtividade e organização por **Domínios**. Ele unifica Servidor HTTP, Agendamento de Tarefas, ORM e Persistência de Estado em uma única ferramenta extensível.

---

## 🚀 Estrutura de Domínios

O Opposer organiza a lógica da sua aplicação em pastas específicas que ele mapeia automaticamente:

```text
project/
├── src/
│   ├── handlers/    # Domínio de Servidor (Ações da API)
│   ├── schedules/   # Domínio de Agendamento (Cron)
│   ├── schemas/     # Domínio de Dados (Entidades ORM)
│   └── index.ts     # Inicialização
├── opposer-settings.json
└── package.json
```

---

## 1. 🌐 Server (Servidor HTTP)

O motor de servidor do Opposer é baseado em **Handlers**. Cada Handler é um domínio de ações que você expõe para a API.

### Exemplo de Handler (`src/handlers/user.ts`)
```typescript
import { Handler, Method, Payload, Success, f, Field } from "opposer/server";

class LoginDto {
    @Field(() => f().string().required())
    username!: string;
    
    @Field(() => f().string().required())
    password!: string;
}

@Handler("auth")
export default class AuthHandler {
    @Method()
    async login(@Payload(LoginDto) payload: any) {
        const { username } = payload.data;
        // Lógica de autenticação...
        return Success({ token: "JWT-AQUI", user: username });
    }
}
```

**Como consumir:** Toda a comunicação é feita via `POST` no endpoint `/opposer` (configurável).
```json
{
    "handler": "auth",
    "method": "login",
    "payload": { "username": "admin", "password": "123" }
}
```

---

## 2. 🎨 Playground (Interface Visual)

O Opposer inclui nativamente um **Playground**, uma interface web completa para desenvolvedores. Ele mapeia automaticamente todos os seus domínios e permite:

- **Explorar Schemas:** Ver a definição de todas as tabelas e tipos de campos.
- **Testar Handlers:** Executar métodos de API diretamente pelo navegador com suporte a JSON.
- **Monitorar Schedulers:** Acompanhar o status das tarefas agendadas em tempo real.
- **Gestão de Usuários:** Criar, editar e excluir usuários do sistema com validações integradas.
- **Gestão de API Keys:** Gerar chaves de acesso (`opposer-key`) para integrações externas.

**Acesso:** `http://localhost:3838/playground`

---

## 3. ⏰ Schedule (Agendamento de Tarefas)

O domínio de agendamento permite criar rotinas automáticas com monitoramento integrado e persistência de histórico de falhas/sucessos.

### Exemplo de Tarefa (`src/schedules/sync.ts`)
```typescript
import { Schedule } from "opposer/scheduler";

export default class InventoryTask {
    @Schedule({ 
        name: "sincronizar-estoque", 
        interval: 60000 // Executa a cada 1 minuto
    })
    async sync() {
        // Lógica de sincronização...
        console.log("Estoque atualizado com sucesso!");
    }
}
```

---

## 4. 🏗️ ORM (Object-Relational Mapping)

O ORM do Opposer gerencia o banco de dados e a integridade dos dados através de decorators. Ele suporta SQLite, MySQL e Postgres.

### Exemplo de Schema (`src/schemas/product.ts`)
```typescript
import { Entity, PrimaryColumn, Field, f, CreateDateColumn } from "opposer/orm";

@Entity("products", "Domínio de Produtos")
export default class Product {
    @PrimaryColumn({ type: "uuid" })
    id!: string;

    @Field(() => f().string().required())
    name!: string;

    @Field({ type: "number", default: 0 })
    stock!: number;

    @Field({ type: "number", default: 0 })
    price!: number;

    @CreateDateColumn()
    createdAt!: Date;
}
```

### 🔍 Query Builder JSON
O Opposer oferece um motor de busca flexível via JSON. Você não precisa informar o `type` se usar as chaves específicas:

#### Filtrar Múltiplos (`filter`)
```json
{
    "method": "get",
    "model": "products",
    "query": {
        "filter": { "stock": { "$lt": 10 } },
        "select": ["id", "name"]
    }
}
```

#### Buscar Um (`find`)
```json
{
    "method": "get",
    "model": "products",
    "query": {
        "find": { "id": "uuid-aqui" }
    }
}
```

#### Contar Registros (`count`)
Retorna a quantidade total de itens que batem com o filtro.
```json
{
    "method": "get",
    "model": "products",
    "query": {
        "count": { "stock": { "$gt": 0 } }
    }
}
```

#### Verificar Existência (`exists`)
Retorna um booleano simples.
```json
{
    "method": "get",
    "model": "products",
    "query": {
        "exists": { "name": "Celular" }
    }
}
```

#### Agregações (`aggregate`)
Suporta `sum`, `avg`, `min`, `max` e `count`.
```json
{
    "method": "get",
    "model": "products",
    "query": {
        "aggregate": {
            "where": { "stock": { "$gt": 0 } },
            "aggregate": { "price": "avg", "stock": "sum" }
        }
    }
}
```

#### Valores Únicos (`distinct`)
```json
{
    "method": "get",
    "model": "products",
    "query": {
        "distinct": { "field": "category" }
    }
}
```

#### Agrupamento (`group`)
```json
{
    "method": "get",
    "model": "products",
    "query": {
        "group": {
            "by": ["category"],
            "aggregate": { "id": "count", "price": "avg" }
        }
    }
}
```

---

## 5. 💾 Persistent (Gestão de Estado e Cache)

O módulo Persistent permite armazenar estados de forma reativa e transparente usando decorators, eliminando a necessidade de gerenciar Redis ou Memcached manualmente para estados simples.

### Exemplo de Persistência
```typescript
import { Global, Session } from "opposer/persistent";

export default class ConfigService {
    @Global() 
    appConfig: any; // Valor compartilhado entre todos os usuários do servidor

    @Session()
    userPreferences: any; // Valor isolado e persistente por sessão de usuário (IP/Cookie)
}
```

---

## ⚙️ Configuração Principal (`opposer-settings.json`)

```json
{
  "port": 3838,
  "database": {
    "type": "sqlite",
    "database": "./database.db",
    "logging": true
  },
  "auth": true,
  "logger": true
}
```

Para começar, inicialize o servidor no seu `index.ts`:
```typescript
import { Server } from "opposer";

const instance = await Server({
    models: "./src/schemas",
    handlers: "./src/handlers",
    schedules: "./src/schedules"
});

instance.initialize();
```

---

## ⚙️ Configurações e Variáveis de Ambiente

O Opposer pode ser configurado através do arquivo `opposer-settings.json` na raiz do projeto ou via variáveis de ambiente. As variáveis de ambiente têm precedência sobre o arquivo JSON.

### Tabela de Referência

| Propriedade JSON | Variável de Ambiente | Descrição | Padrão |
| :--- | :--- | :--- | :--- |
| `port` | `OPPOSER_PORT` | Porta onde o servidor HTTP irá rodar. | `3000` |
| `url` | `OPPOSER_URL` | Endpoint base da API (POST). | `/opposer` |
| `logger` | - | Habilita o middleware de logs de requisição. | `false` |
| `auth` | - | Habilita o sistema de autenticação e permissões. | `false` |
| **Database** | | | |
| `database.type` | `OPPOSER_DATABASE_TYPE` | Tipo do banco (`postgres`, `mysql`, `sqlite`). | - |
| `database.host` | `OPPOSER_DATABASE_HOST` | Host do banco de dados. | - |
| `database.port` | `OPPOSER_DATABASE_PORT` | Porta do banco de dados. | - |
| `database.username` | `OPPOSER_DATABASE_USER` | Usuário do banco de dados. | - |
| `database.password` | `OPPOSER_DATABASE_PASSWORD` | Senha do banco de dados. | - |
| `database.database` | `OPPOSER_DATABASE_NAME` | Nome do banco ou caminho (se sqlite). | - |
| `database.logging` | `OPPOSER_DATABASE_LOGGING`| Habilita logs de queries SQL (`true`/`false`). | `false` |
| **JWT** | | | |
| `jwt.access` | `OPPOSER_JWT_ACCESS` | Secret para o token de acesso (Access Token). | - |
| `jwt.refresh` | `OPPOSER_JWT_REFRESH` | Secret para o token de atualização (Refresh Token). | - |
| `jwt.recover` | `OPPOSER_JWT_RECOVER` | Secret para o token de recuperação de senha. | - |
| **Manager (Admin)**| | | |
| `manager.login` | `OPPOSER_MANAGER_LOGIN` | Login da conta administradora inicial. | - |
| `manager.password`| `OPPOSER_MANAGER_PASSWORD`| Senha da conta administradora inicial. | - |
| `manager.firstName`| `OPPOSER_MANAGER_FIRST_NAME`| Nome do administrador. | - |
| `manager.lastName` | `OPPOSER_MANAGER_LAST_NAME` | Sobrenome do administrador. | - |

> **Nota:** Se o sistema de `auth` estiver ativo e a conta do `manager` não existir no banco de dados, o Opposer irá criá-la automaticamente durante a inicialização usando as configurações acima.
