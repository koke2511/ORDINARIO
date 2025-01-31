import { APIPhone, APIWeather, RestauranteModel, APIWorldTime } from "./types.ts";
import {ObjectId, Collection } from "mongodb";
import {GraphQLError } from "graphql";
import { graphql } from "graphql";
import { formatWithOptions } from "node:util";

type Context ={
    RestaurantCollection: Collection <RestauranteModel>;
}

type addRestaurantArgs = {
    nombre: string, 
    direccion: string, 
    ciudad: string, 
    telefono: string
}

type deleteRestaurantArgs = {
    id: string
}

type getRestaurantArgs = {
    id:string
}

type getRestaurantsArgs = {
    ciudad: string
}

export const resolvers = {
    Query: {
        getRestaurant: async (_parent: unknown, args: getRestaurantArgs, ctx: Context): Promise <RestauranteModel> => {
            const restaurante = await ctx.RestaurantCollection.findOne({_id: new ObjectId(args.id)});

            if(!restaurante){
                throw new GraphQLError("Restaurante no encontrado");
            }

            return restaurante;
        },
        getRestaurants: async (_parent: unknown, args: getRestaurantsArgs, ctx: Context): Promise <RestauranteModel[]> => {
            return await ctx.RestaurantCollection.find({ciudad: args.ciudad}).toArray();
        }
    },
    Mutation: {
        addRestaurant: async(_: unknown, args: addRestaurantArgs, ctx: Context): Promise <RestauranteModel> => {

            const API_KEY = Deno.env.get("API_KEY");
            if(!API_KEY){
                throw new GraphQLError("Necesitamos la API_KEY");
            }

            const {nombre, direccion, ciudad, telefono } = args;

            const telExiste = await ctx.RestaurantCollection.findOne({telefono:telefono});
            if(telExiste){
                throw new GraphQLError ("El telefono ya existe");
            }

            const TelUrl = 'https://api.api-ninjas.com/v1/validatephone?number=' + telefono;

            const datosTel = await fetch(TelUrl, {
                headers: {
                    "X-Api-Key": API_KEY
                }
            })

            if(datosTel.status !== 200){
                throw new GraphQLError("Error API Ninja");
            }

            const respuestaTel: APIPhone = await datosTel.json();

            if(!respuestaTel.is_valid){
                throw new GraphQLError("Telefono no valido");
            }


            const newRestaurante: RestauranteModel = {
                nombre, 
                direccion,
                ciudad, 
                telefono, 
            }

            const {insertedId} = await ctx.RestaurantCollection.insertOne (newRestaurante);
            
            return {
                _id: insertedId,
                nombre, 
                direccion,
                ciudad,
                telefono
            }
            
        
        },
        deleteRestaurant: async (_parent: unknown, args: deleteRestaurantArgs, ctx: Context): Promise <boolean> => {
            const {deletedCount} = await ctx.RestaurantCollection.deleteOne({_id: new ObjectId(args.id)});

            return deletedCount === 1;
        },
    },
    /*
    Restaurante: {
        id: (parent: RestauranteModel): string => {
            return parent._id!.toString();
        }

        /*temperatura: async (parent: RestauranteModel): Promise <string> => {
            const API_KEY = Deno.env.get("API_KEY");
            if(!API_KEY){
                throw new GraphQLError("Necesitamos la API_KEY");
            }
*/

        },

        /*hora_local: async(parent: RestauranteModel): Promise <string> => {
            const API_KEY = Deno.env.get("API_KEY");
            if(!API_KEY){
                throw new GraphQLError("Necesitamos la API_KEY");
            }

            const url = 'https://api.api-ninjas.com/v1/validatephone?number=' + parent.telefono;

            const datosTel = await fetch(url, {
                headers: {
                    "X-Api-Key": API_KEY
                }
            })

            if(datosTel.status !== 200){
                throw new GraphQLError("Error API Ninja");
            }

            const respuestaTel: APIPhone = await datosTel.json();

            const urlLocal = "https://api.api-ninjas.com/v1/worldtime?timezone" + respuestaTel.timezone[0];

            const datosLocal = await fetch(urlLocal, {
                headers: {
                    "X-Api-Key": API_KEY
                }
            })

            if(datosLocal.status !== 200){
                throw new GraphQLError ("Error API Ninja");
            }

            //const horaResponse: APIWorldTime = await datosLocal.json();

            //const formato = horaResponse.hora + : horaResponse.minutos

        
*/

        
        /*direccion: async (parent: RestauranteModel): Promise<string> => {
            const API_KEY = Deno.env.get("API_KEY");
            if(!API_KEY){
                throw new GraphQLError("Necesitamos la API_KEY");
            }

            const url = 'https://api.api-ninjas.com/v1/validatephone?number=' + parent.telefono;

            const datosTel = await fetch(url, {
                headers: {
                    "X-Api-Key": API_KEY
                }
            })

            if(datosTel.status !== 200){
                throw new GraphQLError("Error API Ninja");
            }

            const respuestaPais: APIPhone = await datosTel.json();

            const pais = respuestaPais.country;
            const direccion = parent.direccion + "," + parent.ciudad + "," + pais;
            return direccion;
        }
    
}
        */
