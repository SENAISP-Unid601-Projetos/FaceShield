# FaceShield – Techflow

Sistema completo de **gerenciamento de empréstimo de ferramentas** com **validação por reconhecimento facial**. O FaceShield foi desenvolvido para garantir segurança, rastreabilidade e eficiência no controle de ferramentas, permitindo que empresas controlem usuários, itens e fluxos de empréstimo de maneira moderna e automatizada.

---

## Descrição do Projeto

O **FaceShield** é um sistema integrado que utiliza **reconhecimento facial** para validar usuários durante processos de empréstimo e devolução de ferramentas.  
Além disso, oferece um painel administrativo completo, incluindo:

- CRUD de usuários
- CRUD de ferramentas
- CRUD de locais e estados
- Controle de empréstimos
- Histórico completo de atividades
- Busca detalhada por ferramentas disponíveis
- Filtros avançados por localização, estado e disponibilidade

O objetivo é entregar segurança, organização e facilidade no controle de ativos físicos da empresa.

---

## Arquitetura do Sistema

O projeto é composto por três partes principais:

1. **Back-End 1** – API principal (Spring Boot + Java)
2. **Back-End 2** – Serviço de Reconhecimento Facial (Python)
3. **Front-End** – Interface web (HTML + CSS + JS)

Banco de dados utilizado: **PostgreSQL**

---

## Tecnologias Utilizadas

### Back-End

- **Spring Boot (Java)** – API principal
- **Python** – Módulo de Reconhecimento Facial

### Front-End

- **HTML**
- **CSS**
- **JavaScript**

### Banco de Dados

- **PostgreSQL**

---

## Instalação e Configuração

### 1. Clonar os repositórios

```bash
git clone https://github.com/FaceShield-SENAI-TCC/Back_End.git
git clone https://github.com/FaceShield-SENAI-TCC/Reconhecimento_Facial.git
git clone https://github.com/FaceShield-SENAI-TCC/Front_End.git
```

---

## 2. Configurar o Front-End

```bash
cd Front_End
code .
```

---

## 3. Configurar o Back-End (Java – Spring Boot)

1-Abra a pasta Back_End no IntelliJ
2-Aguarde o Maven baixar as dependências
3-Clique em Run para iniciar a API

---

## 4. Configurar o Reconhecimento Facial (Python)

1-Abra a pasta Reconhecimento_Facial no PyCharm
2-Instale as dependências:

```bash
pip install -r requirements_completo.txt
```
3-Execute o projeto no PyCharm

## 5. Configurar o Banco (PostgreSQL)

1-Instale PostgreSQL
2-Configure a senha do usuário postgres como: "root"
3-Crie uma database chamada:"faceshield"

---

## Execução do Sistema

Após configurar tudo:
Execute o Back-End Java
Execute o Back-End Python
Abra o Front-End no navegador
O sistema estará funcionando de forma integrada.

---

## Contato

LinkedIn – Kauã Frenedozo
Link: `in/kau%C3%A3-frenedozo-8641492b5`
