import {Property} from "./Property";
import {PrimaryKeyC} from "./PrimaryKey";
import {ResolvedNormalizedEntity} from "./Querys";

const registeredEntities: Map<Function, string> = new Map<Function, string>();
export const EntitiesData: Map<Function, {primary: PrimaryKeyC; properties: Array<Property>}> = new Map<Function, {primary: PrimaryKeyC; properties: Array<Property>}>();
export const BufferedEntities: Array<{target: Function; property: Property}> = new Array<{target: Function; property: Property}>();
const BufferedEntitiesCheck: Map<Function, {primary: PrimaryKeyC; properties: Array<Property>}> = new Map<Function, {primary: PrimaryKeyC; properties: Array<Property>}>();
export const parsedEntities: Array<ResolvedNormalizedEntity> = new Array<ResolvedNormalizedEntity>();
const datatypes = ["string", "number", "boolean", "date", "double", "char"];

export function Entity(name: string): ClassDecorator {
    return (target) => {
        console.log("🔷 Testing necesity: "+target.name);
        console.log("From Entity: ")
        console.log(target)
        registeredEntities.set(target, "Entity");
        EntitiesData.set(target, {primary: null, properties: []});
        BufferedEntitiesCheck.set(target, {primary: null, properties: []});
    };
}

export function checkIfEntity(target: Function) {
    console.log("From Check: ")
    console.log(target)

    if (!target) {
        console.log("🚨 Error: El target no es válido");
        return false;
    }

    console.log("🚨 Getting name for check: " + target.name);
    return registeredEntities.get(target) === "Entity";
}

export function showEntitiesData() {
    EntitiesData.forEach((value, key) => {
        console.log(`🔷 Entity: ${key.name}`);
        console.log(`🔷 Properties: ${value.properties.map(prop => prop.name).join(", ")}`);
        console.log(`🔷 Primary key: ${value.primary}`);
        console.log("--------------------");
    });
}

export function showBufferedEntities() {
    BufferedEntities.forEach((value) => {
        if (value.property instanceof PrimaryKeyC) {
            console.log(`🔷🔶 BUFFERED Propertie is Primary Key`);
        }
        console.log(`🔷🔶 BUFFERED Entity: ${value.target.name}`);
        console.log(`🔷🔶 BUFFERED Propertie name: ${value.property.name}`);
        console.log(`🔷🔶 BUFFERED Propertie type: ${value.property.type}`);

        console.log("--------------------");
    });
}

export function showEntitiesDataBuff() {
    BufferedEntitiesCheck.forEach((value, key) => {
        console.log(`🔷📕 Entity: ${key.name}`);
        console.log(`🔷📕 Properties: ${value.properties.map(prop => prop.name).join(", ")}`);
        console.log(`🔷📕 Primary key: ${value.primary}`);
        console.log("--------------------");
    });
}


export function transformBufferedToValidatedData() {
    BufferedEntities.forEach((value) => {
        const entityData = BufferedEntitiesCheck.get(value.target);
        if (!entityData) {
            throw new Error(`❌ Error: No se encontró la entidad para ${value.target.name}`);
        }
        if (value.property instanceof PrimaryKeyC) {
            if (entityData.primary != null) {
                throw new Error(`❌ Error: Clase ${value.target.name} ya tiene una llave primaria`);
            }

            entityData.primary = value.property;
            console.log(`🔷🔶🔑 Setting primary key ${value.property.name} to class ${value.target.name}`);
        } else {
            if (!datatypes.includes(value.property.type)) {
                throw new Error(`❌ Error: Tipo de dato no válido para la propiedad ${value.property.name}`);
            }

            console.log(`🔷📕🗓️ Adding property ${value.property.name} to class ${value.target.name}`);
            entityData.properties.push(value.property);
        }
    });

    BufferedEntitiesCheck.forEach((value, key) => {
        if (!value.primary) {
            throw new Error(`❌ Error: La entidad ${key.name} no tiene una llave primaria`);
        }
        EntitiesData.set(key, value);
    });

    console.log("🔷📕🔑 Validating entities data");
    showEntitiesDataBuff();
    BufferedEntitiesCheck.clear()
    showEntitiesDataBuff();
}

export function showNormalizedEntities() {
    EntitiesData.forEach((value, key) => {
        const normalized = {
            Entity_Name: key.name,
            details: {
                Primary_Key: value.primary.name,
                Properties: value.properties
            }
        }
        console.log(normalized);
        console.log("*********************")
    })
}