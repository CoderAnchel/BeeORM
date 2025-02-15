
import "reflect-metadata";
import {parsedEntities} from "../entity-decorator";
import {EntityProperties, ResolvedNormalizedEntity} from "../Querys";
import {BeeORM} from "../main";

export class BeeRepository<T> {
    private entityType: new () => T;
    private tableName: string;
    private primaryKey: string;
    private properties: ResolvedNormalizedEntity;

    constructor(entity: new () => T) {
        this.entityType = entity;

        // Buscar la entidad en el mapa SIN instanciarla
        parsedEntities.forEach((ent) => {
            if (ent.key == entity.name) {
                console.log("🗿FINDED")
                this.properties = ent;
            }
        })


        this.tableName = entity.name;
        this.primaryKey = this.properties.properties[0].Field;
    }

    getNameTable(): string {
        console.log("🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀", parsedEntities);
        return this.tableName;
    }

    getPrimaryKey(): string {
        return this.primaryKey;
    }

    async getAll(): Promise<Array<T>> {
        const entities: Array<T> = new Array<T>();
        try {
            const data = await BeeORM.query(`SELECT * FROM ${this.tableName}`);
            (data as any[]).forEach((item: any) => {
                const entity = new this.entityType();
                Object.keys(item).forEach((key) => {
                    entity[key] = item[key];
                });
                entities.push(entity);
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        return entities;
    }

    async insert(entity: T): Promise<void> {
        const keys = Object.keys(entity);
        const values = Object.values(entity);
        const query = `INSERT INTO ${this.tableName} (${keys.join(", ")}) VALUES (${values.map((value) => `'${value}'`).join(", ")})`;
        try {
            await BeeORM.query(query);
        } catch (error) {
            console.error("Error inserting data:", error);
        }
    }

    async delete(entity: T): Promise<void> {
        const query = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ${entity[this.primaryKey]}`;
        try {
            await BeeORM.query(query);
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    }

    async getById(id: number): Promise<T> {
        const entity = new this.entityType();
        try {
            const data = await BeeORM.query(`SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ${id}`);
            if (data.length > 0) {
                Object.keys(data[0]).forEach((key) => {
                    entity[key] = data[0][key];
                });
            } else {
                console.error("No data found for the given ID");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        return entity;
    }
}
