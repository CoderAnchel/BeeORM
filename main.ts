import fs from "fs";
import path from "path";
import {pathToFileURL} from "url";
import {
    showBufferedEntities,
    showEntitiesData,
    showEntitiesDataBuff, showNormalizedEntities,
    transformBufferedToValidatedData, EntitiesData, parsedEntities
} from "./entity-decorator";
import mysql, {Connection} from "mysql2/promise";
import {BufferedEntities, checkIfEntity} from "./entity-decorator";
import {Property} from "./Property";
import "reflect-metadata";
import {startupQuery} from "./Querys";
import {BeeRepository} from "./RepoUtils/PosibleWays";
import {Gato, Perro} from "./Entities/user";


export async function loadEntities(directory: string) {
    const entitiesPath = path.resolve(directory); // Resolviendo ruta absoluta

    if (!fs.existsSync(entitiesPath)) {
        throw new Error(`❌ Error: La carpeta de entidades no existe -> ${entitiesPath}`);
    }

    const files = fs.readdirSync(entitiesPath);

    for (const file of files) {
        if (file.endsWith(".ts") || file.endsWith(".js")) {
            const filePath = pathToFileURL(path.join(entitiesPath, file)).href; // Convertir a URL
            await import(filePath); // Importar dinámicamente
        }
    }

    console.log(`✅ Entidades cargadas desde: ${entitiesPath}`);
    showEntitiesData();
    showBufferedEntities();
    showEntitiesDataBuff();
    transformBufferedToValidatedData();
    showEntitiesData();
    showNormalizedEntities()
}


async function connection(conn: { host: string; user: string; password: string; database: string;}){
    return mysql.createConnection({
        host: conn.host,
        user: conn.user,
        password: conn.password,
        database: conn.database
    });
}

// Función para cerrar la conexión
async function closeConnection(connection: Connection) {
    if (connection) {
        await connection.end();
        console.log("✅ Conexión cerrada.");
    } else {
        console.error("❌ No hay conexión para cerrar.");
    }
}

export class BeeORM{
    static dbConnection: Connection;

    static async init(route: string){
        await loadEntities(route);
    }

    static async connection(conn: { host: string; user: string; password: string; database: string;}){
        this.dbConnection = await connection(conn);
    }

    static async closeConnection(){
        await closeConnection(this.dbConnection);
    }

    static async test() {
        if (!this.dbConnection) {
            console.error("❌ No hay conexión a la base de datos.");
            return;
        }

        try {
            const [rows, fields] = await this.dbConnection.execute(
                "CREATE TABLE IF NOT EXISTS usersPrueba (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), name2 VARCHAR(255))"
            );
            console.log("✅ Tabla creada o ya existe:", rows);
        } catch (err) {
            console.error("❌ Error al ejecutar la consulta:", err);
        }
    }

    static async query(query: string) {
        if (!this.dbConnection) {
            console.error("❌ No hay conexión a la base de datos.");
            return;
        }

        try {
            const [rows, fields] = await this.dbConnection.execute(query);
            console.log("row ",rows);
            console.log("fields ",fields);
            return rows;
        } catch (e) {
            console.error("Error executing query ❌")
        }
    }

    static async BeeFactory(T) {
        return new BeeRepository(T)
    }

}

await BeeORM.init("./Entities");
await BeeORM.connection({
    host: "localhost",
    user: "root",
    password: "kgyspy10230",
    database: "albertBank"
});
await BeeORM.test();
await BeeORM.query("CREATE TABLE IF NOT EXISTS usersPrueba2 (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), surname VARCHAR(255))")
await BeeORM.query("INSERT INTO usersPrueba2 (name) VALUES ('Alberto')");
await BeeORM.query("SELECT * FROM usersPrueba");
await startupQuery(EntitiesData);

const catsRepo = await BeeORM.BeeFactory(Gato);
catsRepo.getNameTable();
catsRepo.getAll();
console.log(catsRepo.getPrimaryKey());

const gato = new Gato();
gato.raza = "Mishi";
gato.gato_id = 80;
gato.nombre = "Mishi";

const data = await catsRepo.getById(24);
console.log("CAT:",data);

const entities: Array<Gato> = await catsRepo.getAll();
console.log(entities);
