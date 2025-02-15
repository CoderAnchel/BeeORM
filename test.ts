import {GlobalContext, global} from "../Engine/GlobalContext";
import {Initializer} from "../Core/Initializer";

// Obtener e instanciar la clase bajo demanda
export function getService(serviceName: string) {
    const ServiceClass = global.servicesContext.get(serviceName) as { new (): any };
    if (ServiceClass) {
        return new ServiceClass();  // Instanciamos la clase solo cuando la necesitamos
    }
    return null;
}