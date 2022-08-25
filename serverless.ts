import type { AWS } from "@serverless/typescript";
import functions from "./handler";

//https://www.serverless.com/framework/docs/providers/aws/guide/serverless.yml

const serverlessConfiguration: AWS = {
  service: "ohealth-serverless-backend",
  frameworkVersion: "*",
  configValidationMode: "warn",
  custom: {
    ["bundle"]: {
      packager: "yarn",
      sourcemaps: true,
      caching: false,
      esbuild: true,
      linting: false,
      ignorePackages: ["pg-native"],
      externals: ["node-pre-gyp"],
      aliases: [
        {
          database: ["database/*"],
          controllers: ["controllers/*"],
          routes: ["routes/*"],
          services: ["services/*"],
          types: ["types/*"],
        },
      ],
    },
    ["serverless-offline"]: {
      // httpPort: 3005,
      allowCache: false,
      noPrependStageInUrl: true,
    },
    secrets: "${file(./secrets.yml):${self:provider.stage}}",
  },
  plugins: ["serverless-bundle", "serverless-offline"],
  package: {
    individually: true,
  },
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    stage: "${opt:stage, 'staging'}",
    region: "ap-southeast-1",
    lambdaHashingVersion: "20201221",
    apiGateway: {
      shouldStartNameWithService: true,
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      FIREBASE_API_KEY: "${self:custom.secrets.FIREBASE_API_KEY}",
      FIREBASE_SERVICE_ACCOUNT: "${self:custom.secrets.FIREBASE_SERVICE_ACCOUNT}",
      MIXPANEL_TOKEN: "${self:custom.secrets.MIXPANEL_TOKEN}",
      DS_HOST: "${self:custom.secrets.DS_HOST}",
      DS_PORT: "${self:custom.secrets.DS_PORT}",
      DS_USERNAME: "${self:custom.secrets.DS_USERNAME}",
      DS_PASSWORD: "${self:custom.secrets.DS_PASSWORD}",
      DS_DATABASE: "${self:custom.secrets.DS_DATABASE}",
      STAGE: "${self:provider.stage}",
    },
  },
  functions: functions,
};

module.exports = serverlessConfiguration;
