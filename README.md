# Custom API Gateway Authorizer

Authorizes requests to the nRF Cloud API with Cognito Tokens.

It fetches the Cognito Identity ID for the user pool token.
The user information will be on `event.requestContext.authorizer`:

```json
{
    cognitoIdentityId: 'us-east-1:...', 
    'cognito:username': 'alex.doe@example.com',
    email: 'alex.doe@example.com'
}
```

## Tests

Set these environment variables:

    user_pool_url=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_fdiBa7JSO
    identity_pool_id=us-east-1:c00e1327-dfc2-4aa7-a484-8ca366d11a68
    username=user@example.com
    password=changeme
    client_id=bmoej5j8t187jmnumu00jrt2v
    AWS_ACCESS_KEY_ID=changeme
    AWS_SECRET_ACCESS_KEY=changeme
