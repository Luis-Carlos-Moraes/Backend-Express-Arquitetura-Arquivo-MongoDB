# Etapa 2 (Backend – Express + Arquitetura + Arquivo + MongoDB)

## Desafio

Construir uma **API Express** para gerenciar **alunos**, com persistência **em arquivo** e em **MongoDB**, **organizando o código em uma arquitetura minimamente limpa** (separação de responsabilidades, camadas e módulos).

**Tempo sugerido:** ~30 min
**Stack:** Node.js + Express + MongoDB (JavaScript, sem TypeScript)

> **Antes de começar (2–5 min):**
> Explique rapidamente **como você costuma organizar a arquitetura** de APIs Node.js (camadas, pastas, separação de responsabilidades).

---

## O que você vai entregar

* Uma API Node.js + Express com:

  * Rotas para **cadastrar** e **listar** alunos em **MongoDB**.
* Projeto minimamente **organizado em camadas**, por exemplo:

  * Arquivo de entrada do servidor (`server.js`/`index.js`).
  * Pasta de **rotas** (ex.: `routes/`).
  * Pasta de **controllers/handlers** (ex.: `controllers/`).
  * Pasta de **serviços/repositórios** para acesso a dados (arquivo + MongoDB).
  * Arquivo/pasta de **configuração** (ex.: conexão Mongo, variáveis de ambiente).
* Um **README** com:

  * Como rodar o projeto.
  * Como configurar o `.env`.
  * **Breve explicação das decisões de arquitetura**.

---

## Rotas obrigatórias

### Parte 1 — Arquivo (`alunos.json`)

1. **POST `/aluno/cadastrar`**

   **Body (JSON):**

   ```json
   {
     "nome": "Maria",
     "email": "maria@example.com",
     "dataNascimento": "2000-01-01",
     "matricula": "20251234"
   }
   ```

   **Regra:** adicionar ao arquivo **`alunos.json`** (não sobrescrever; sempre acumular).

2. **GET `/aluno/listar`**

   Lê **`alunos.json`** e retorna a lista de alunos em **JSON**.

---

### Parte 2 — MongoDB

3. **POST `/aluno/cadastrar-db`**

   Mesmo payload do cadastro em arquivo, **salvando no MongoDB**.

4. **GET `/aluno/listar-db`**

   Retorna todos os alunos armazenados no **MongoDB** em **JSON**.

---

### Parte 3 — Repositório

5. Publique o código no **GitHub** (repositório público).

---

## Requisitos técnicos

* Tratar **arquivo inexistente** de forma segura (criar `alunos.json` vazio se necessário).
* Validar minimamente o payload (**campos obrigatórios**: `nome`, `email`, `dataNascimento`, `matricula`).
* Usar **variáveis de ambiente** para conexão MongoDB (ex.: `MONGO_URI`).
* Definir **status HTTP adequados** para sucesso e erro.
* Não deixar toda a lógica direto no `server.js`/`index.js` — **separar em módulos**.

---

## Requisitos de arquitetura

Não precisa ser perfeito nem ultra complexo, mas queremos ver uma **preocupação real com arquitetura**:

* **Separação de responsabilidades**:

  * Rotas apenas definem **endpoints e chamam handlers**.
  * Controllers/handlers cuidam de **entrada/saída HTTP** (req/res).
  * Serviços/repositórios concentram a **lógica de negócio e acesso a dados** (arquivo + MongoDB).

* **Tratamento de erros**:

  * Responder mensagens claras em caso de falha (ex.: problema de I/O ou conexão com Mongo).
  * Retornar status codes coerentes (400, 404, 500, etc.).
* **Código legível**:

  * Nomes de funções e variáveis que expliquem o que fazem.
  * Evitar duplicação quando possível (ex.: mesma validação usada para arquivo e DB).

---

## Testes rápidos (curl)

```bash
# cadastrar em arquivo
curl -X POST http://localhost:3001/aluno/cadastrar \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria","email":"maria@example.com","dataNascimento":"2000-01-01","matricula":"20251234"}'

# listar do arquivo
curl http://localhost:3001/aluno/listar

# cadastrar no banco
curl -X POST http://localhost:3001/aluno/cadastrar-db \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@example.com","dataNascimento":"1999-05-10","matricula":"20251111"}'

# listar do banco
curl http://localhost:3001/aluno/listar-db
```

---

## Critérios de avaliação

* **Resolução do Problema**

  * Rotas funcionam e atendem ao enunciado (arquivo + MongoDB).
  * Fluxo básico de cadastro/listagem funcionando.

* **Conhecimento Técnico**

  * Uso de **Express** (rotas, middlewares básicos).
  * I/O de arquivos com Node.js.
  * Integração com **MongoDB** usando string de conexão via `.env`.

* **Arquitetura / Organização**

  * Separação entre **rotas, controllers/handlers e repositórios/serviços**.
  * Organização de pastas coerente.
  * Evita tudo em um único arquivo gigante.

* **Boas Práticas**

  * Código claro, legível e sem complexidade desnecessária.
  * Validações mínimas de entrada.
  * Status HTTP e mensagens de erro razoáveis.

* **Documentação**

  * README com:

    * Como rodar o projeto.
    * Como configurar o `.env`.
    * **Resumo das decisões de arquitetura**.

---

## Entrega

* Publique em um **repositório público** no GitHub.
* Envie o link conforme orientado no processo seletivo.
