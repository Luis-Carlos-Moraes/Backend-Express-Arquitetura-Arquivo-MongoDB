# 🎓 Desafio Técnico – Sênior II Backend (Node.js + Express + MongoDB)

Seja muito bem-vindo(a) ao desafio técnico para a vaga de **Sênior II Backend**!

Este desafio foi desenhado para avaliar sua capacidade de **design de arquitetura**, **modelagem de domínio**, **implementação de regras de negócio complexas**, **concorrência/consistência em banco de dados** e **testes automatizados**.

Para que você **não perca tempo** configurando ferramentas básicas, entregamos um ambiente pré-configurado e 100% funcional.

---

## ⚡ Inicialização Rápida (Menos de 2 minutos)

O ambiente já está preparado para **não gerar conflito de portas** com serviços que você já tenha rodando na sua máquina:
- **MongoDB**: roda no Docker mapeado na porta **`27028`** (em vez da 27017 padrão).
- **API Express**: roda na porta **`3333`** (em vez da 3000 padrão).
- **Testes**: utilizam `mongodb-memory-server` em memória (rodam instantaneamente sem depender do Docker).

### Fluxo de Inicialização:

1. **Subir o MongoDB**: Utilizar o `docker-compose.yml` disponibilizado (o banco está configurado para subir na porta **`27028`**).
2. **Instalar as Dependências**: Instalar os pacotes definidos no `package.json`.
3. **Popular o Banco (Seed)**: Executar o script de seed para cadastrar os cursos iniciais de teste.
4. **Iniciar a Aplicação**: Rodar a aplicação em modo de desenvolvimento (configurada na porta **`3333`**).
5. **Executar os Testes**: Rodar a suíte de testes automatizados.

> **Endpoints para validação:**
> - Healthcheck: `GET http://localhost:3333/health`
> - Cursos iniciais: `GET http://localhost:3333/courses`

---

## 🎯 O Cenário de Negócio

Você assumirá o backend de um **Sistema de Gestão de Matrículas e Bolsas Educacionais**.

A aplicação gerencia o cadastro de alunos, cursos oferecidos e o processo de matrícula, aplicando regras de elegibilidade, cálculo automático de bolsas de estudo, controle de capacidade de turmas com fila de espera e repescagem automática em caso de cancelamento.

---

## 🏗️ Sua Missão no Desafio

### 1. Refatoração e Design de Arquitetura (Foco Principal)
O código inicial em `src/app.js` foi intencionalmente escrito de forma simples e acoplada apenas para viabilizar a execução imediata.

Sua primeira missão é **redesenhar e organizar a arquitetura da aplicação** utilizando o padrão que você considerar ideal para uma aplicação escalável e manutenível (ex.: *Clean Architecture*, *Hexagonal / Ports and Adapters*, *Arquitetura em Camadas / DDD simplificado*).

Esperamos ver:
- Separação clara de responsabilidades:
  - **Rotas / HTTP Handlers / Controllers**: tradução de requisições e respostas.
  - **Casos de Uso / Serviços de Domínio**: onde vivem as regras de negócio puras (desacopladas de frameworks e do banco).
  - **Repositórios / Camada de Dados**: persistência e consultas no MongoDB.
  - **Entidades de Domínio / Validações**: regras intrínsecas dos dados.
  - **Tratamento Global de Erros**: mapeamento de exceções de domínio para respostas HTTP semânticas.

---

### 2. Implementação das Regras de Negócio

Você deverá implementar os fluxos completos descritos abaixo:

#### A. Gestão de Alunos (`/students`)
- **Cadastro de Aluno (`POST /students`)**:
  - Campos: `nome`, `cpf`, `email`, `dataNascimento`, `rendaFamiliar`.
  - **Validações:**
    - CPF deve ser válido (formato/dígitos) e **único**.
    - Email deve ter formato válido e ser **único**.
    - Campos obrigatórios preenchidos.
- **Listagem de Alunos (`GET /students`)**:
  - Retornar a lista de alunos cadastrados.

---

#### B. Processo de Matrícula (`POST /enrollments`)
Ao receber uma solicitação de matrícula contendo `{ alunoId, cursoId }`:

1. **Validação de Elegibilidade por Idade Mínima:**
   - O aluno deve ter idade igual ou superior à `idadeMinima` exigida pelo curso na data da matrícula.
   - Caso não atinja a idade mínima, a requisição deve ser rejeitada com erro semântico de regra de negócio (`422 Unprocessable Entity`).

2. **Cálculo Automático de Bolsa de Estudo:**
   - A mensalidade final da matrícula deve ser calculada a partir da `rendaFamiliar` do aluno:
     | Faixa de Renda Familiar | Percentual de Bolsa | Valor da Mensalidade Final |
     | :--- | :---: | :--- |
     | Até **R$ 2.824,00** (até 2 salários mínimos) | **50%** | 50% do valor do curso |
     | De **R$ 2.824,01** até **R$ 5.648,00** (2 a 4 salários) | **20%** | 80% do valor do curso |
     | Acima de **R$ 5.648,00** | **0%** | Valor integral do curso |
   - O percentual de bolsa aplicado e o valor final da mensalidade devem ser gravados no registro da matrícula.

3. **Controle Atômico de Vagas & Fila de Espera:**
   - Se o curso **ainda tiver vagas disponíveis** (`vagasOcupadas < capacidadeVagas`):
     - A matrícula é criada com status **`CONFIRMADA`**.
     - O campo `vagasOcupadas` do curso deve ser incrementado de forma **atômica e segura contra condições de corrida (race conditions)**.
   - Se o curso **estiver lotado** (`vagasOcupadas >= capacidadeVagas`):
     - A matrícula é criada com status **`FILA_ESPERA`** (sem incrementar vagas ocupadas).

4. **Prevenção de Duplicidade:**
   - Um aluno **não pode** possuir mais de uma matrícula com status `CONFIRMADA` ou `FILA_ESPERA` no mesmo curso.

---

#### C. Cancelamento de Matrícula com Repescagem (`PATCH /enrollments/:id/cancel`)
Ao cancelar uma matrícula:

1. A matrícula alvo tem seu status alterado para **`CANCELADA`**.
2. **Repescagem da Fila de Espera:**
   - Se a matrícula cancelada era `CONFIRMADA`:
     - O sistema deve verificar se existem alunos na **`FILA_ESPERA`** daquele curso (ordenados cronologicamente pela data de inscrição).
     - Se houver alguém na fila, o **primeiro da fila** deve ser automaticamente promovido para o status **`CONFIRMADA`**.
     - Se não houver ninguém na fila de espera, a vaga do curso é liberada (`vagasOcupadas` decrementa).

---

#### D. Listagem de Matrículas (`GET /enrollments`)
- Permitir listar matrículas com suporte a filtros opcionais por query string:
  - `cursoId`: filtrar por curso.
  - `alunoId`: filtrar por aluno.
  - `status`: filtrar por status (`CONFIRMADA`, `FILA_ESPERA`, `CANCELADA`).

---

## 📡 Tabela de Endpoints da API

| Método | Endpoint | Descrição | Status de Sucesso |
| :--- | :--- | :--- | :---: |
| `GET` | `/health` | Status da API e conexão do MongoDB | `200 OK` |
| `GET` | `/courses` | Listar cursos disponíveis e quantidade de vagas | `200 OK` |
| `POST` | `/students` | Cadastrar novo aluno | `201 Created` |
| `GET` | `/students` | Listar alunos cadastrados | `200 OK` |
| `POST` | `/enrollments` | Realizar matrícula (regras de idade, bolsa, vagas e fila) | `201 Created` |
| `GET` | `/enrollments` | Listar matrículas com filtros opcionais | `200 OK` |
| `PATCH` | `/enrollments/:id/cancel` | Cancelar matrícula e promover repescagem da fila | `200 OK` |

---

## 🧪 Testes Automatizados

Como engenheiro(a) Sênior, a qualidade e testabilidade do seu código são essenciais:
- **Testes Unitários:** Cubra as regras de negócio isoladamente (cálculo de bolsa por faixa de renda, validação de idade mínima, regras de transição de status).
- **Testes de Integração:** Cubra os principais endpoints da API (cenário de matrícula com vaga, matrícula caindo em fila de espera, cancelamento com promoção automática).
- A suíte de testes configurada no projeto deve executar todos os testes com sucesso.

---

## 🏆 Critérios de Avaliação (Nível Sênior II)

| Pilar | O que avaliamos |
| :--- | :--- |
| **Arquitetura & Clean Code** | Clareza na separação de responsabilidades, desacoplamento das regras de negócio do framework/banco, coesão e legibilidade do código. |
| **Modelagem de Domínio** | Regras de negócio encapsuladas em serviços/use cases, clareza nos fluxos e invariantes de domínio. |
| **Concorrência & Atomicidade** | Tratamento seguro de incremento/decremento de vagas no MongoDB para evitar inconsistências em concorrência. |
| **Testes Automatizados** | Estratégia de testes, facilidade de manutenção e cobertura de cenários de sucesso e borda (*edge cases*). |
| **Tratamento de Erros & HTTP** | Uso semântico de status HTTP (400, 404, 409, 422, 500) e mensagens de erro estruturadas e previsíveis. |
| **Documentação & Decisões** | Clareza na seção de documentação do seu README explicando a arquitetura escolhida, decisões de design e trade-offs. |

---

## 📝 Documentação das suas Decisões (Preencher na Entrega)

No seu README final de entrega, adicione uma seção explicando brevemente:
1. **Padrão de Arquitetura Escolhido**: Por que escolheu essa estrutura de pastas e camadas?
2. **Tratamento de Concorrência/Vagas**: Como você garantiu que duas requisições simultâneas não estourem a capacidade de vagas do curso?
3. **Decisões e Trade-offs**: Quais decisões você tomou e o que você faria de diferente em um ambiente produtivo de larga escala?

---

## 🚀 Como Entregar

1. Suba a solução em um **repositório público ou privado** no GitHub (se privado, compartilhe com o usuário avaliador conforme instruído).
2. Certifique-se de que a aplicação sobe corretamente, o seed popula o banco e os testes automatizados executam com sucesso.
3. Envie o link do repositório conforme as instruções do processo seletivo.

*Boa sorte! Estamos ansiosos para ver a sua solução e conversar sobre suas decisões de engenharia!*
