# Opposer

Opposer é um ecossistema modular para construção de aplicações modernas, focado em alta produtividade e organização por **Domínios**. Ele unifica Servidor HTTP, Agendamento de Tarefas, ORM e Persistência de Estado em uma única ferramenta extensível e altamente performática.

---

## 🚀 Estrutura de Domínios

O Opposer organiza a lógica da sua aplicação em pastas específicas que ele mapeia automaticamente. Esta arquitetura orientada a domínios facilita a escalabilidade e a manutenção do código:

```text
project/
├── src/
│   ├── controllers/ # Domínio de Servidor (Endpoints da API e Lógica de Negócio)
│   ├── schedules/   # Domínio de Agendamento (Tarefas Agendadas e Background Jobs)
│   ├── models/      # Domínio de Dados (Entidades do Banco de Dados e Regras de Validação)
│   └── index.ts     # Ponto de entrada para inicialização do ecossistema
├── opposer-settings.json # Arquivo de configuração centralizado
└── package.json
```

---

## 1. 🌐 Controller (Servidor HTTP)

O motor de servidor do Opposer utiliza o conceito de **Controllers**. Cada Controller agrupa ações relacionadas a um domínio específico. Utilizando decorators, você define métodos que serão expostos automaticamente como endpoints da API.

### Exemplo de Controller (`src/controllers/auth.ts`)
```typescript
import { Controller, Method, Payload, Success, f, Field } from "opposer/server";

// DTO (Data Transfer Object) para validação rigorosa de entrada
class LoginDto {
    @Field(() => f().string().required().description("Usuário cadastrado"))
    username!: string;
    
    @Field(() => f().string().required().min(6).description("Senha de acesso"))
    password!: string;
}

@Controller("auth")
export default class AuthController {
    @Method()
    async login(@Payload(LoginDto) payload: any) {
        const { username } = payload.data;
        
        // O Opposer garante que 'payload.data' já está validado conforme o LoginDto
        // Implemente sua lógica de negócio aqui...
        
        return Success({ 
            token: "JWT-TOKEN-EXEMPLO", 
            user: username,
            message: "Bem-vindo ao sistema!"
        });
    }
}
```

**Como consumir:** A comunicação é centralizada via `POST` no endpoint `/opposer` (padrão). Isso simplifica a gestão de rotas e permite um protocolo de comunicação estruturado.

```json
{
    "controller": "auth",
    "method": "login",
    "payload": { "username": "admin", "password": "safe-password" }
}
```

---

## 2. 🎨 Playground (Dashboard de Desenvolvimento)

O Opposer inclui nativamente o **Playground**, uma interface administrativa e de desenvolvimento que se auto-configura com base nos seus domínios:

- **Explorar Models:** Visualize todas as tabelas, tipos de dados e relacionamentos definidos no sistema.
- **Testar Controllers:** Interface interativa para disparar métodos dos seus controllers, visualizar retornos e validar payloads JSON.
- **Monitorar Schedulers:** Painel em tempo real para acompanhar execuções, erros e status das tarefas agendadas.
- **Gestão de Usuários:** Módulo completo para administração de contas, com suporte nativo a Roles e Permissions.
- **Gestão de Segurança:** Geração de API Keys e gerenciamento de segredos JWT diretamente pela interface.

**Acesso:** [http://localhost:3838/playground](http://localhost:3838/playground)

---

## 3. ⏰ Schedule (Automação de Tarefas)

O módulo de Schedule permite automatizar processos com controle total de execução e histórico de logs.

### Exemplo de Tarefa Agendada (`src/schedules/cleanup.ts`)
```typescript
import { Schedule } from "opposer/schedule";

export default class MaintenanceTask {
    @Schedule({ 
        name: "limpeza-logs", 
        interval: "24h", // Suporta formatos legíveis como "1m", "1h", "1d"
        description: "Remove logs antigos do banco de dados diariamente"
    })
    async run() {
        // Lógica de manutenção preventiva...
        console.log("Rotina de limpeza executada.");
    }
}
```

---

## 4. 🏗️ ORM (Gestão de Dados Inteligente)

O ORM do Opposer é uma camada de abstração poderosa que permite definir seu banco de dados usando classes TypeScript. Ele cuida da criação de tabelas, índices e relacionamentos complexos automaticamente.

### Exemplo de Model (`src/models/user.ts`)
```typescript
import { Entity, PrimaryColumn, Field, f, CreateDateColumn, Relation } from "opposer/orm";
import Role from "./role";

@Entity("users", "Domínio de Usuários do Sistema")
export default class User {
    @PrimaryColumn({ type: "uuid" })
    id!: string;

    @Field(() => f().string().required().unique())
    email!: string;

    @Field({ type: "string", select: false }) // Não retorna no 'select' por padrão por segurança
    password!: string;

    @Relation({
        type: "one-to-many",
        target: () => Role,
        inverseSide: "user"
    })
    roles!: Role[];

    @CreateDateColumn()
    createdAt!: Date;
}
```

---

### 🔍 Query Builder O-API (JSON)

O Opposer expõe um motor de busca avançado via JSON que permite consultas complexas sem a necessidade de criar novos endpoints.

#### Filtros e Seleção
```json
{
    "method": "get",
    "model": "users",
    "query": {
        "filter": { "active": true },
        "select": ["id", "email"],
        "relation": ["roles"],
        "limit": 10
    }
}
```

#### Agregações e Agrupamentos
```json
{
    "method": "get",
    "model": "products",
    "query": {
        "group": {
            "by": ["category"],
            "aggregate": { "price": "avg", "id": "count" }
        }
    }
}
```

---

## 5. 💾 Persistent (Estado e Cache Reativo)

Gerencie estados globais ou de sessão de forma transparente. O Opposer lida com a persistência em memória ou disco automaticamente.

### Exemplo
```typescript
import { Global, Session } from "opposer/persistent";

export default class AppState {
    @Global() 
    maintenanceMode: boolean = false; // Estado compartilhado em toda a instância

    @Session()
    themePreference: string = "dark"; // Estado persistente por usuário
}
```

---

## 🌐 Contexto de Aplicação

Acesse recursos do ecossistema de qualquer lugar do seu código através do Singleton de Contexto.

```typescript
import { Context } from "opposer/server";
import { OpposerDatabase } from "opposer/orm";

const db = Context.get<OpposerDatabase>("db");
```

---

## ⚙️ Inicialização do Projeto

Configure e inicie seu servidor Opposer em poucos segundos:

```typescript
import { Server } from "opposer";

const app = await Server({
    models: "./src/models",
    controllers: "./src/controllers",
    schedules: "./src/schedules"
});

app.initialize();
```

---

## 🛠️ Variáveis de Ambiente e Configurações

O arquivo `opposer-settings.json` na raiz do projeto permite configurar o comportamento do ecossistema. Variáveis de ambiente (`.env`) sempre terão prioridade.

| JSON Path | Variável de Ambiente | Descrição |
| :--- | :--- | :--- |
| `port` | `OPPOSER_PORT` | Porta do servidor (Default: 3838) |
| `database.type` | `OPPOSER_DATABASE_TYPE` | `postgres`, `mysql` ou `sqlite` |
| `auth` | - | Habilita sistema de segurança nativo |
| `jwt.access` | `OPPOSER_JWT_ACCESS` | Segredo para assinatura de tokens |

---

### ⌨️ CLI Helpers
- `npx opposer generate:jwt-key`: Gera um segredo seguro para JWT.
- `npx opposer generate:api-key`: Gera uma chave de acesso para integrações externas.
