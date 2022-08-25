# OHealth-backend

## Prerequisites

- secrets.yml file
- env file if referenced
- yarn installed

## Run Locally

#### Install Dependencies

```shell
yarn
```

#### Run Dev environment

```shell
yarn dev
```

### Authorisation required to test

#### POST

```shell
https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={firebaseApiKey}
```

#### POST Body

https://firebase.google.com/docs/reference/rest/auth

```json
{
  "email": "${some test email}",
  "password": "${some test password}",
  "returnSecureToken": true
}
```

This will return an object with a key called `idToken`, use that value as your bearer token as part of authenticated request. Different account has different roles which would be needed depending on the API being called.

## Deploying

### Requirment

AWS IAM Creds added into serverless local creds

```shell
serverless config credentials --provider aws --key {aws_access_key_id} --secret {aws_secret_access_key}
```

### Staging

```shell
sls deploy --stage staging
```

### Production

```shell
sls deploy --stage production
```
