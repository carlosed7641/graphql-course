import { gql, ApolloServer } from "apollo-server"

const persons = [
    {
        name: "Carlos",
        phone: "1111",
        city: "Barranquilla",
        id: "1abc",
        street: "calle 1"
    },
    {
        name: "Juan",
        phone: "2222",
        city: "Medellin",
        id: "2abc",
        street: "calle 2"
    },
    {
        name: "Mateo",
        city: "Bogota",
        id: "3abc",
        street: "calle 3"
    }
]

const typeDefs = gql`

    type Address {
        street: String!
        city: String!
    }

    type Person {
        name: String!
        phone: String
        address: Address!
        isRolo: Boolean!
        id: ID!
    }

    type Query {
        personCount: Int!
        allPersons: [Person]!
        findPerson(name: String!): Person
    }
`

const resolvers =  {
    Query: {
        personCount: () => persons.length,
        allPersons: () => persons,
        findPerson: (root, args) => {
            const { name } = args
            return persons.find(person => person.name === name)
        }
    },
    Person: {
        isRolo: (root) => root.city === "Bogota",
        address: (root) => {
            return {
                street: root.street,
                city: root.city
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({url})=> {
    console.log(`Server ready at ${url}`)
})

