<p align="center">
  <a href="https://github.com/CoderAnchel/BeeORM" target="blank"><img src="bee.png" width="700" alt="BeeORM Logo" /></a>
</p>

<p align="center">A TypeScript ORM inspired by JPA – A Side Project for Learning</p>
<p align="center">
<a href="https://github.com/CoderAnchel/BeeORM" target="_blank"><img src="https://img.shields.io/github/languages/top/CoderAnchel/BeeORM.svg" alt="TypeScript" /></a>
<a href="https://www.npmjs.com/package/beeorm" target="_blank"><img src="https://img.shields.io/npm/v/beeorm.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/beeorm" target="_blank"><img src="https://img.shields.io/npm/l/beeorm.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/package/beeorm" target="_blank"><img src="https://img.shields.io/npm/dm/beeorm.svg" alt="NPM Downloads" /></a>
</p>

##  📌 Description

BeeORM is a **TypeScript-based ORM** that I built as a side project, inspired by **Java's JPA.** One day, I thought it would be a great way to deepen my understanding of TypeScript by trying to create something similar.

This project is not meant to compete with or improve existing TypeScript ORMs—it's purely a learning experience. BeeORM uses decorators to define entities and properties, making database interactions more intuitive. It currently supports **MySQL** and focuses on **entity registration**, **metadata handling**, and **query execution**.

> **⚠️ Note:** This project is *not* intended to replace or improve existing TypeScript ORMs. It’s purely a learning experience!

## Key Features

- 🏗 **Decorator-based entity definitions**:
  - Use decorators to define entities and their properties, making the code more readable and maintainable.
- 🗄 **Supports MySQL**
  - BeeORM supports MySQL as the database backend, allowing you to perform CRUD operations seamlessly.
- 🛠 **Handles entity registration & metadata**
  - Automatically registers entities and manages metadata, simplifying the setup process.
- ⚡ **Executes queries in an intuitive way**
  - Provides a straightforward API for executing queries, making database interactions easier.
- 🏭 **Repository for retrieving and pushing data**
  - Similar to JPA and TypeORM, BeeORM includes a repository pattern for managing data access, providing methods for common operations like finding, saving, and deleting entities.

Similar to JPA and TypeORM, BeeORM includes a repository pattern for managing data access, providing methods for common operations like finding, saving, and deleting entities.

### Entity Definitions

BeeORM uses decorators to define entities and their properties. Here is an example of how to define a `User` entity::

```typescript
import { Entity, Column, PrimaryKey } from 'beeorm';

@Entity('user')
class User {
  @PrimaryKey('number')
  id!: number;

  @Column('string')
  name!: string;

  @Column('string')
  email!: string;
}
```
```typescript
import { getRepository } from 'beeorm';
import { User } from './entities/user';

const userRepository = getRepository(User);

// Encontrar un usuario por ID
const user = await userRepository.findOne(1);

// Guardar un nuevo usuario
const newUser = new User();
newUser.name = 'John Doe';
newUser.email = 'john.doe@example.com';
await userRepository.save(newUser);

// Eliminar un usuario
await userRepository.delete(1);
```
**When you define an entity, BeeORM creates the corresponding table for you. If you change a type, it will be updated. If you add a new attribute, it will create a new column. You can forget about all the configuration once you are done.**


## Installation

1. Install the npm package:

   `npm install typeorm --save`

3. You may need to install node typings:

   `npm install @types/node --save-dev`


##### TypeScript configuration

Also, make sure you are using TypeScript version **4.5** or higher,
and you have enabled the following settings in `tsconfig.json`:

```json
"emitDecoratorMetadata": true,
"experimentalDecorators": true,
```

You may also need to enable `es6` in the `lib` section of compiler options, or install `es6-shim` from `@types`.

## Quick Start

The quckiest way to start its dimple create a plain node project then 
```shell
npm i beeorm
```

Create a file for beeorm initializer:

```ts
import { BeeORM } from "beeorm/main";
import {Product} from "./Entities/User";

async function initialize() {
    //Entities folder
    await BeeORM.init("./Entities");
    //DB connection
    await BeeORM.connection({
        host: "localhost",
        user: "root",
        password: "******",
        database: "xxxxxx"
    });
    //read your proyect decorators and magic happend
    await BeeORM.StartupQuery();
    //create repos
    const productRepo = await BeeORM.BeeFactory(Product);
}
initialize().catch(console.error);
```

This Entity will be represented has follows

```typescript
import {Entity, Column} from "typeorm"
import {PrimaryKey} from "./primaryKey-decorator";

@Entity("Photo")
export class Photo {
    @PrimaryKey("id")
    @Column("number")
    id: number

    @Column("string")
    name: string

    @Column("string")
    description: string

    @Column("string")
    filename: string

    @Column("number")
    views: number

    @Column("boolean")
    isPublished: boolean
}
```

### Running the application

Now if you run your `index.ts`, a connection with the database will be initialized and a database table for your photos will be created.

```shell
+-------------+--------------+----------------------------+
|                         photo                           |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| name        | varchar(100) |                            |
| description | text         |                            |
| filename    | varchar(255) |                            |
| views       | int(11)      |                            |
| isPublished | boolean      |                            |
+-------------+--------------+----------------------------+
```

### Core Technologies

- ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
- ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
- ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?logo=mysql&logoColor=white&style=for-the-badge)

### Dependencies

- [**Reflect-Metadata**](https://www.npmjs.com/package/reflect-metadata)
- [**MySQL2**](https://www.npmjs.com/package/mysql2)

## Getting Started

Note: BeeORM is a side project created for learning purposes. If there is enough interest, I will consider creating detailed documentation. For now, it serves as a fun and educational project.

## Questions

For questions and support, please use the official [GitHub Issues](https://github.com/CoderAnchel/BeeORM/issues). The issue list of this repo is **exclusively** for bug reports and feature requests.

## License

BeeORM is [MIT licensed](LICENSE).