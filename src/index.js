import fetch from 'node-fetch';
import { ApolloServer } from 'apollo-server';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';
import { getRemoteSchema } from './utils';

const HASURA_GRAPHQL_ENGINE_URL = process.env.HASURA_GRAPHQL_ENGINE_URL || `https://bazookaand.herokuapp.com`;
const HASURA_GRAPHQL_API_URL = HASURA_GRAPHQL_ENGINE_URL + '/v1alpha1/graphql';
const ACCESS_KEY = process.env.X_HASURA_ACCESS_KEY;

const runServer = async () => {

  // make Hasura schema
  const executableHasuraSchema = await getRemoteSchema(
    HASURA_GRAPHQL_API_URL,
    ACCESS_KEY && { 'x-hasura-access-key': ACCESS_KEY }
  );

  const finalSchema = mergeSchemas({
    schemas: [
      executableHasuraSchema,
    ],
  });

  // instantiate a server instance
  const server = new ApolloServer({
    schema: finalSchema,
    introspection: true,
    playground: false
  });

  // run the server
  server.listen({
    port: process.env.PORT || 4000
  }).then(({url}) => {
    console.log('Server running. Open ' + url + ' to run queries.');
  });
}

try {
  runServer();
} catch (e) {
  console.log(e, e.message, e.stack);
}
