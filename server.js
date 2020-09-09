const { ApolloServer } = require("apollo-server");

// The GraphQL schema
const typeDefs = require("./graphql/typeDefs");

// A map of functions which return data for the schema.
const resolvers = require("./graphql/resolvers");
const contextMiddleware = require("./utils/contextMiddleware");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
