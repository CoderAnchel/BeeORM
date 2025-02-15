import {BufferedEntities, checkIfEntity} from "./entity-decorator";
import {Property} from "./Property";

export function Column(type: string, options?: Array<string>): PropertyDecorator{
    return (target, propertyKey) => {

        const propertyName = propertyKey.toString();

        console.log(`🐐 TYPE: ${type}`);
        console.log(`🔶 Creating bean for property ${propertyName} from class ${target.constructor.name}`)

        // Usamos setTimeout para retrasar la ejecución y asegurar que la clase haya sido registrada

        // const isEntity = checkIfEntity(target.constructor);
        // console.log(`Is this class an Entity? ${isEntity}`);
        console.log(`🔷 Adding property ${propertyName} to class ${target.constructor.name}`);
        const property = new Property(propertyName, type);
        BufferedEntities.push({target: target.constructor, property});
        console.log(`🔷 Property created: ${property.name}`);
    }
}
