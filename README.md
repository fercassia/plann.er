# Plann.er NLW - Node.js 

Projeto criado durante os 3 dias do nlw - node.js. O projeto é conhecido como Plann.er, cujo o proposito é de gerenciamento de viagens com os Amigos. As funções são:

- Escolher localidade e data
- Convidar pessoas
- Confirmação via email do usuario
- Manter atividades das viagens e convidados

Documentação do layout: [Figma](https://www.figma.com/community/file/1392277205162897872/nlw-journey-roteiro-de-viagem). 

## Tecnologias utilizadas no Desenvolvimento

- Node.js - [NVM Windows v20.15.0](https://github.com/coreybutler/nvm-windows)
- TypeScript - [Versão 5.5.3](https://www.typescriptlang.org/) ; [Configuração](https://github.com/tsconfig/bases?tab=readme-ov-file)
- NPM - [Versão 10.7.0](https://www.npmjs.com/package/npm/v/10.7.0)
- IDE de desenvolvimento (Sugestão) - [Visual Studio Code](httpscode.visualstudio.com)
- Prisma - [Extensão VSC](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
- Eslint - [Extensão VSC](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- TSX - [Documentação](https://tsx.is/)
- Fastify - [Documentação](https://fastify.dev/)
- Zod - [Documentação](https://zod.dev/?id=introduction)
- Fastivy Type Provider Zod - [Dcoumentação](https://github.com/turkerdev/fastify-type-provider-zod)

> Deve ter instalado na sua máquina `Node.js` e `npm` para rodar o projeto.

## Instalação

1. Clone o projeto `https://github.com/fercassia/plann.er.git`.

2. Entre na pasta do projeto clonado `plann.er`

3. Rode `npm install` (ou `npm i`) para instalar as dependências de desenvolvimento do package.json.

## Execução

1. Para a execução do projeto, rode o comando `npx tsx {nomeDoArquivo}` ou `npm run dev {nomeDoArquivo}`.

2. Para a execução do projeto e ficar observando as mudanças do código, rode o comando `npx tsx watch {nomeDoArquivo}` ou `npm run dev:watch {nomeDoArquivo}`.

> __Atenção__: Deve executar o nome do arquivo com a localização atual do arquivo e sua. (p.ex: src/server.ts ou server.ts)

3. Para a criação de uma tabela contida no prisma `npx prisma migrate dev` ou `npm run psm:migrate-dev`.

4. Para a visualização dos dados  contidos nas tabelas do prisma `npx prisma studio` ou `npm run psm:open`.

## Architecture

- `src`: Diretório responsável por armazenar arquivos de serviços.

    - `lib`: Diretório responsável por armazenar arquivos de logs e dependências externas.
       
     - `server.ts`: Arquivo responsável por iniciar aplicação e configurar porta servidor.

    - `routes`: Diretório responsável por armazenar arquivos de rotas.


- `prisma`: Diretório responsável por armazenar arquivos das tabelas dos bancos de dados.

    > OBS: Importante seguir a sintaxe do prisma.

    - `migrations`: Diretório responsável por armazenar arquivos de migrações.

- `.env`: Arquivo responsável por armazenar variáveis de ambiente.

- `.gitignore`: Arquivo responsável por armazenar arquivos/diretórios para serem ignorados ao subir para o repositório (p.ex: node_modules).

- `package.json`: Arquivo responsável por armazenar as dependências do projeto.

- `tsconfig.js`: Arquivo responsável configurar o typescript de acordo com a versão do node.


