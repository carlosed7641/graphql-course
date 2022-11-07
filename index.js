import { gql, ApolloServer, UserInputError } from "apollo-server"
import { v1 as uuid} from 'uuid'

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

    enum YesNo {
        YES
        NO
    }

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
        allPersons (phone: YesNo): [Person]!
        findPerson(name: String!): Person
    }

    type Mutation {
        addPerson (
            name: String!
            phone: String
            city: String!
            street: String!
        ): Person
        editNumber(
            name: String!
            phone: String!
        ): Person
    }
    
`

const resolvers =  {
    Query: {
        personCount: () => persons.length,
        allPersons: (root, args) =>  {
            if (!args.phone) return persons

            return persons.filter(person => {
               return args.phone === "YES" ? person.phone : !person.phone
            })

        },
        findPerson: (root, args) => {
            const { name } = args
            return persons.find(person => person.name === name)
        }
    },

    Mutation: {
        addPerson: (root, args) => {

            if (persons.find(p => p.name === args.name)) {
                throw new UserInputError('Name must be unique', {
                    invalidArgs: args.name
                })
            }
            const person = {...args, id: uuid()}
            persons.push(person)
            return person
        },
        editNumber: (root, args) => {
            const personIndex = persons.findIndex(p => p.name === args.name)
            if (personIndex === -1) return null

            const person = persons[personIndex]
            
            const updatedPerson = {...person, phone: args.phone}
            persons[personIndex] = updatedPerson
            return updatedPerson
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

