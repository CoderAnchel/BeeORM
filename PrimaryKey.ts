import {Property} from "./Property";

export class PrimaryKeyC extends Property {
    constructor(name: string, type: string, options?: Array<string>) {
        super(name, type, options);
    }
}