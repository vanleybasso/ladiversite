# 🛒 La Diversité - E-commerce de Bebidas Importadas

Este projeto é o resultado do Trabalho de Conclusão de Curso (TCC) do curso de Tecnologia em Análise e Desenvolvimento de Sistemas do Instituto Federal do Rio Grande do Sul – Campus Sertão.

## 📌 Descrição

O sistema consiste em uma plataforma de e-commerce desenvolvida para a empresa fictícia **La Diversité**, especializada na venda de bebidas importadas. O objetivo principal é automatizar o processo de vendas, modernizar o atendimento ao cliente e ampliar o alcance digital da marca.

A plataforma permite que os clientes:
- Visualizem produtos em destaque,
- Apliquem filtros por nome, categoria e preço,
- Consultem os detalhes dos produtos,
- Adicionem itens ao carrinho,
- Finalizem a compra com pagamento via cartão ou PIX,
- Consultem seu histórico de pedidos.

Além disso, há um ambiente administrativo para o gerenciamento completo do catálogo de produtos.

## 🎯 Objetivos

### Objetivo Geral
Desenvolver uma plataforma de e-commerce para vendas online de bebidas importadas, promovendo praticidade, escalabilidade e autonomia tanto para clientes quanto para administradores.

### Objetivos Específicos
- Criar interface responsiva e acessível;
- Implementar cadastro e login com autenticação via Clerk;
- Permitir gerenciamento de produtos pelo administrador;
- Oferecer checkout com múltiplas formas de pagamento;
- Garantir a segurança dos dados e boa usabilidade.

## 🛠️ Tecnologias Utilizadas

- **Front-end:** React + TypeScript
- **Estilização:** TailwindCSS
- **Autenticação:** Clerk
- **Estado Global:** Redux
- **Banco de Dados Simulado:** JSON Server
- **API de Endereços:** BrasilCEP
- **Versionamento:** Git + GitHub

## 🖥️ Funcionalidades Principais

### Cliente
- Cadastro e login (tradicional ou Google)
- Navegação e filtro de produtos
- Carrinho de compras
- Checkout com endereço e método de pagamento
- Histórico de pedidos
- Avaliação de produtos

### Administrador
- Acesso restrito via role no Clerk
- Cadastro, edição e exclusão de produtos
- Visualização dos pedidos

## 📦 Instalação e Execução

Siga os passos abaixo para rodar o projeto localmente:

1. Clone this repo

```bash
git clone https://github.com/vanleybasso/ladiversite.git
```

2. Install the packages and dependencies using npm

```bash
npm install
```

3. Instale o JSON Server globalmente

```
npm install -g json-server
```

4. Execute o projeto, inicie o front-end

```bash
npm run dev
```

5. Inicie o back-end

```bash
npm run server
```

6. Visit the app

```
localhost:5173
```





