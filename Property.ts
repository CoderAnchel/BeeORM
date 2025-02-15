export class Property {
    name: string;
    type: string;
    options: any;
    property: any;

    constructor(name: string, type: string, options?: Array<string>) {
        this.name = name;
        this.type = type;
        this.options = options;
    }

    setProperty(property: any) {
        this.property = property;
    }

    getProperty() {
        return this.property;
    }
}