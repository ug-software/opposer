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

    @CreateDateColumn()
    createdAt!: Date;
}
```

O Opposer também oferece um **Query Builder** JSON para buscas flexíveis:
```json
{
    "method": "get",
    "model": "products",
    "query": {
        "type": "filter",
        "filter": { "stock": { "$lt": 10 } } // Filtra produtos com estoque baixo
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
    modelsPath: "./src/schemas",
    handlersPath: "./src/handlers",
    schedulesPath: "./src/schedules"
});

instance.initialize();
```
