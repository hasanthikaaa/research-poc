import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'my-serverless-project',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild'],
  provider: {
    component: "@sls-next/serverless-component@3.8.0",
    name: 'aws',
    //@ts-ignore
    runtime: 'nodejs18.x',
    timeout: 15,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { 
    nextApp: {
      handler: "frontend-app/.output/server.handler",
      events: [
        {
          httpApi: "*"
        }
      ]
    }
   },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      external: [
        "sharp", 
        "react", 
        "react-dom",
        "react-server-dom-webpack", 
        "esbuild", 
        "@swc/core",
        'next',
        'watchpack',
        'critters',
        'next/dist/*',
        './babel/loader/index',
      ],
      // buildDir: ".build",
      packager: "npm"
    },
  },
};

module.exports = serverlessConfiguration;
