import {PrimaryKeyC} from "./PrimaryKey";
import {BufferedEntities} from "./entity-decorator";

export function PrimaryKey(type: string, options?: Array<string>): PropertyDecorator {
    return (target, propertyKey) => {
        console.log(`🔑 Adding Primary key ${propertyKey.toString()} to class ${target.constructor.name}`)
        const property = new PrimaryKeyC(propertyKey.toString(), type);
        BufferedEntities.push({target: target.constructor, property});
    }
}