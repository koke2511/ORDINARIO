import { OptionalId } from "mongodb";

export type RestauranteModel = OptionalId<{
    nombre: string, 
    direccion: string, 
    ciudad: string, 
    telefono: string,
}>;

export type APIPhone ={
    is_valid: boolean,
    country: string,
    timezone: [string]
};

export type APIWeather = {
    latitud: string, 
    longitud: string
}

export type APIWorldTime = {
    hora: string, 
    minutos: string
}
