import { Entity } from "../entity-decorator";
import {Column} from "../column-decorator";
import {PrimaryKey} from "../primaryKey-decorator";

@Entity("user")
class User {
    @PrimaryKey("number")
    id!: number;
    name!: string;
}

@Entity("product")
class Product {
    @PrimaryKey("number")
    id!: number;
    @Column("number", ["unique"])
    price!: number;
}

@Entity("test")
class test {
    @PrimaryKey("number")
    id!: number;
    price!: number;
}

class Car {
    id: number
    price2!: number;
}

@Entity("test")
class Test {
    @PrimaryKey("number")
    id!: number;
    @Column("number")
    price!: number;
}

@Entity("Perro")
export class Perro {
    @PrimaryKey("number")
    perro_id: number;
    @Column("string")
    raza: string;
    @Column("string")
    nombre: string;
}

@Entity("Gato")
export class Gato {
    @PrimaryKey("number")
    gato_id: number;
    @Column("string")
    raza: string;
    @Column("string")
    nombre: string;
}

@Entity("Gato")
class Gato2 {
    @PrimaryKey("number")
    gato_id: number;
    @Column("string")
    raza: string;
    @Column("string")
    nombre: string;
    @Column("string")
    nombre2: string;
}

@Entity("Gato")
class Gato3 {
    @PrimaryKey("number")
    gato_id: number;
    @Column("string")
    raza: string;
    @Column("string")
    nombre: string;
    @Column("string")
    nombre2: string;
}

@Entity("Gato")
class Gato4 {
    @PrimaryKey("number")
    gato_id: number;
    @Column("string")
    raza: string;
    @Column("string")
    nombre: string;
    @Column("string")
    nombre2: string;
    @Column("number")
    nombre3: string;
}

@Entity("Gato")
class testEntity {
    @PrimaryKey("number")
    id: number
    @Column("string")
    name: string;
    @Column("char")
    name2: string;
    @Column("boolean")
    name3: boolean;
    @Column("double")
    name4: number;
}