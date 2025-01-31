export const schema = `#graphql

type Restaurante {
    id: ID!,
    nombre: String!,
    direccion: String!,
    telefono: String!,
    hora: String!,
    temperatura: String!
}

type Query {
    getRestaurant(id: ID!): Restaurante!
    getRestaurants(ciudad: String!): [Restaurante!]!
}

type Mutation {
    addRestaurant(nombre: String!, direccion: String!, ciudad: String!, telefono: String!): Restaurante!
    deleteRestaurant(id: ID!): Boolean!
}

`