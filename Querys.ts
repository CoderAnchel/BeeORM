import {PrimaryKeyC} from "./PrimaryKey";
import {Property} from "./Property";
import {EntitiesData, parsedEntities} from "./entity-decorator";
import {BeeORM} from "./main";
import {FieldPacket} from "mysql2";

export interface normalizedEntity {
    Entity_Name: string,
    details: {
        Primary_Key: string,
        Primary_KeyDT: string,
        Properties: Array<Property>
    }
}

export interface EntityProperties {
    Field: string,
    Type: string,
    Null: string,
    Key: string,
    Default: null,
    Extra: string
}

export interface ResolvedNormalizedEntity {
    key: string,
    properties: Array<EntityProperties>
}

export async function startupQuery(EntitiesData: Map<Function, {primary: PrimaryKeyC; properties: Array<Property>}>) {
    const promises = [];

    EntitiesData.forEach((value, key) => {
        const normalized: normalizedEntity = {
            Entity_Name: key.name,
            details: {
                Primary_Key: value.primary.name,
                Primary_KeyDT: value.primary.type,
                Properties: value.properties
            }
        }

        function validateDataType(type: string) {
            switch (type) {
                case "string":
                    return "varchar(255)"
                    break
                case "char":
                    return "char"
                    break
                case "number":
                    return "int"
                    break
                case "double":
                    return "float"
                    break
                case "boolean":
                    return "boolean"
                    break
                case "Date":
                    return "date"
                    break
                default:
                    return "varchar(255)"
                    break
            }
        }

        const queryBuilder: string = `CREATE TABLE IF NOT EXISTS ${normalized.Entity_Name} (${normalized.details.Primary_Key} ${validateDataType(normalized.details.Primary_KeyDT)} PRIMARY KEY ${normalized.details.Properties.length > 0 ? ',' : ''} ${normalized.details.Properties.map((value, index, array) => {
            return `${value.name} ${validateDataType(value.type)} ${index < array.length - 1 ? ',' : ''}`
        }).join(' ')})`;

        BeeORM.query(queryBuilder);

        console.log("QUERY FOR "+normalized.Entity_Name+" ------------------");
        console.log(queryBuilder);
        console.log("--------------------------------------------------------");

        /**
         * Asynchronously checks and updates the columns of the table corresponding to the normalized entity.
         *
         * - Logs the current columns of the table.
         * - Compares the current columns with the normalized properties.
         * - Adds missing columns and modifies altered columns if there are discrepancies.
         */
        const promise = (async () => {
            // 🟢 Log: Indicating the start of the column check process
            console.log("COLUMNS FOR " + normalized.Entity_Name + " ------------------");
            // 🔍 Step 1: Retrieve the current columns from the database
            const [columns]: [any[], FieldPacket[]] = await BeeORM.dbConnection.execute(`SHOW COLUMNS FROM ${normalized.Entity_Name}`);
            // 🟢 Log: Displaying current table columns
            console.log(columns);

            // 🔄 Step 2: Normalize the entity properties into a database-compatible structure
            const entityProperties = normalized.details.Properties.map(prop => ({
                Field: prop.name,
                Type: validateDataType(prop.type),
                Null: 'YES',
                Key: '',
                Default: null,
                Extra: ''
            }));

            // 🔄 Step 3: Define the expected column structure, including the primary key
            const normalizedColumns = [
                {
                    Field: normalized.details.Primary_Key,
                    Type: validateDataType(normalized.details.Primary_KeyDT),
                    Null: 'NO',
                    Key: 'PRI',
                    Default: null,
                    Extra: ''
                },
                ...entityProperties
            ];

            const resolvedNormalizedEntity: ResolvedNormalizedEntity = {
                key: key.name,
                properties: normalizedColumns
            }

            parsedEntities.push(resolvedNormalizedEntity);

            // 🟢 Log: Displaying expected column structure
            console.log("Normalized Columns: ", normalizedColumns);

            // 🔄 Step 4: Compare database columns with expected columns
            const columnsMatch = columns.length === normalizedColumns.length && columns.every((col, index) => {
                const normalizedCol = normalizedColumns[index];
                return col.Field === normalizedCol.Field &&
                    col.Type === normalizedCol.Type &&
                    col.Null === normalizedCol.Null &&
                    col.Key === normalizedCol.Key &&
                    col.Default === normalizedCol.Default &&
                    col.Extra === normalizedCol.Extra;
            });

            // 🟢 Log: Indicating whether columns match
            console.log(`Columns match for ${normalized.Entity_Name}: ${columnsMatch}`);

            // ⚠️ If columns do not match, proceed with updates
            if (!columnsMatch) {
                // 🔍 Step 5: Identify missing and altered columns
                const existingFields = columns.map(col => col.Field);
                // 🔴 Find missing columns (columns in `normalizedColumns` but not in `columns`)
                const missingFields = normalizedColumns.filter(col => !existingFields.includes(col.Field));
                // 🟠 Find altered columns (columns with a different type)
                const alteredFields = normalizedColumns.filter(col => {
                    const existingCol = columns.find(c => c.Field === col.Field);
                    return existingCol && existingCol.Type !== col.Type;
                });

                // 🔵 Find removed columns (columns in `columns` but not in `normalizedColumns`)
                const removedFields = columns.filter(col => !normalizedColumns.some(nCol => nCol.Field === col.Field));

                // ➕ Step 6: Add missing columns
                for (const field of missingFields) {
                    const alterQuery = `ALTER TABLE ${normalized.Entity_Name} ADD COLUMN ${field.Field} ${field.Type}`;
                    await BeeORM.dbConnection.execute(alterQuery);
                    console.log(`Added column ${field.Field} to ${normalized.Entity_Name}`);
                }

                // 🔄 Step 7: Modify altered columns
                for (const field of alteredFields) {
                    const alterQuery = `ALTER TABLE ${normalized.Entity_Name} MODIFY COLUMN ${field.Field} ${field.Type}`;
                    await BeeORM.dbConnection.execute(alterQuery);
                    console.log(`Modified column ${field.Field} in ${normalized.Entity_Name}`);
                }

                // ➖ Step 8: Remove deleted columns
                for (const field of removedFields) {
                    const alterQuery = `ALTER TABLE ${normalized.Entity_Name} DROP COLUMN ${field.Field}`;
                    await BeeORM.dbConnection.execute(alterQuery);
                    console.log(`Removed column ${field.Field} from ${normalized.Entity_Name}`);
                }
            }
        })();

        promises.push(promise);
    })

    return Promise.all(promises);
}