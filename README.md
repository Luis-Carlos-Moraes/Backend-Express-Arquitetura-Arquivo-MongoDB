# Backend – Express + Arquitetura + MongoDB

## Desafio

Construir uma **API Express** para gerenciar **alunos**, com persistência em **MongoDB**, organizada em uma **arquitetura minimamente limpa** (separação de responsabilidades, camadas e módulos).

**Tempo sugerido:** ~30 min
**Stack:** Node.js + Express + MongoDB (JavaScript, sem TypeScript)

> **Antes de começar (2–5 min):**
> Explique rapidamente **como você costuma organizar a arquitetura** de APIs Node.js (camadas, pastas, separação de responsabilidades).

---

## O que você vai entregar

* Uma API Node.js + Express com rotas para:

  * **Cadastrar** alunos em MongoDB.
  * **Listar** alunos do MongoDB.
* Projeto minimamente **organizado em camadas**, contemplando:

  * Ponto de entrada do servidor.
  * Camada de **rotas**.
  * Camada de **controllers/handlers**.
  * Camada de **serviços/repositórios** para acesso a dados (MongoDB).
  * Camada de **configuração** (ex.: conexão Mongo, variáveis de ambiente).
* Um **README** com:

  * Como rodar o projeto.
  * Como configurar o `.env`.
  * **Breve explicação das decisões de arquitetura**.

---

## Rotas obrigatórias

* Rota para **cadastrar** um aluno em MongoDB.

  * Deve receber os dados do aluno via corpo da requisição.
* Rota para **listar** todos os alunos cadastrados em MongoDB.

  * Deve retornar a lista em formato JSON.

Os campos mínimos esperados para o aluno são:
`nome`, `email`, `dataNascimento`, `matricula`.

Você é livre para definir nomes exatos de rotas, formatos de resposta e estrutura de pastas, desde que sejam coerentes e estejam documentados.

---

## Requisitos técnicos

* Validação mínima dos dados de entrada (campos obrigatórios).
* Uso de **variáveis de ambiente** para a string de conexão com o MongoDB.
* Conexão com o banco centralizada em um ponto de configuração.
* Uso de **status HTTP adequados** para sucesso e erro.
* Lógica de negócio e de acesso a dados **não** concentrada apenas no arquivo principal do servidor.

---

## Requisitos de arquitetura

Não precisa ser perfeito nem cheio de patterns, mas queremos ver:

* **Separação de responsabilidades**:

  * Rotas apenas definem endpoints e encaminham a chamada.
  * Controllers/handlers cuidam de traduzir requisição/resposta.
  * Serviços/repositórios cuidam da lógica de negócio e do acesso ao MongoDB.
* **Tratamento de erros**:

  * Mensagens claras em caso de falha.
  * Status code coerente com o tipo de erro.
* **Código legível**:

  * Nome de arquivos, funções e variáveis que indiquem claramente o propósito.
  * Evitar duplicação desnecessária.

---

## Critérios de avaliação

* **Resolução do problema**

  * Cadastro e listagem de alunos funcionam conforme descrito.

* **Conhecimento técnico**

  * Uso adequado de Express.
  * Integração com MongoDB.
  * Uso de `.env` para configurações sensíveis.

* **Arquitetura / organização**

  * Separação de camadas (rotas, controllers, serviços/repositórios, config).
  * Estrutura de código que facilite manutenção e evolução.

* **Boas práticas**

  * Código claro, objetivo e sem complexidade desnecessária.
  * Validações mínimas de entrada.
  * Tratamento razoável de erros.

* **Documentação**

  * README com instruções para rodar o projeto e configurar o ambiente.
  * Breve explicação das decisões de arquitetura.

---

## Entrega

* Publique o código em um **repositório público** no GitHub.
* Envie o link conforme orientado no processo seletivo.
