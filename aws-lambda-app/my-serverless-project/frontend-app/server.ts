//@ts-nocheck
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import next from 'next';
import awsLambdaFastify from 'aws-lambda-fastify';

const isDev = process.env.NODE_ENV !== 'production';
const app = next({dev: isDev});
const handle = app.getRequestHandler();

let fastifyProxy: ReturnType<typeof awsLambdaFastify>;

const startServer = async() => {
    await app.prepare();
    fastifyProxy = awsLambdaFastify((req, res) => handle(req, res))
}

startServer();

export const handler = async(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>  => {
    if(!fastifyProxy){
        await startServer();
    }
    return fastifyProxy(event, context);
}