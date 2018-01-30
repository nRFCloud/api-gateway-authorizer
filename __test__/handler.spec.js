'use strict'

/* global expect describe test  */

const pjson = require('../package.json')
const {handler: authorizer} = require('../')
const {CognitoIdentityServiceProvider} = require('aws-sdk')

describe(pjson.name, () => {
  test('expired token', done => {
    const authorizationToken = 'Bearer eyJraWQiOiI2WUpiTWV6MGdHUHNpT0pPM1YyaWplKzJsUWUzUTEyd1FEazZ1cjhCUkdnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIxOTA2NzIwOC03ODU1LTQ4Y2YtYjNlNy1hMzYxOWNmMTQyMTkiLCJhdWQiOiJibW9lajVqOHQxODdqbW51bXUwMGpydDJ2IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiYThkMWQ5M2MtMDRmYS0xMWU4LWJjNWYtMjc1YmI5OTYyYmI3IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1MTcyMzM1MjUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX2ZkaUJhN0pTTyIsImNvZ25pdG86dXNlcm5hbWUiOiJtYXRhLm5vcmRpYysyQGdtYWlsLmNvbSIsImV4cCI6MTUxNzIzNzEyNSwiaWF0IjoxNTE3MjMzNTI1LCJlbWFpbCI6Im1hdGEubm9yZGljKzJAZ21haWwuY29tIn0.jy83r_b7fXmKGhX3_1g4xXE0WwKCQouyMKMfDetyVQd7TuEocs0pnlGxSXeoPCDojPwOWkU7e3_DX8D9yM3ntvR5raigC6YJB6gjZUCgTLt9-xcnFlhk1KEMfQxMGUQIr4gsBOAE2KzNifWkLvdPr91kY17MMWmWU20NaoSgFkT-4zjDn_W-R5UgRTv76-5sayXCIdj_mcBcmkiKAx9T1bNPjPRYtBVkqNhUjXCvlnJVYKf2_TEsM9fdXoIUjrTLvs0NBnfJzIwvFfytuZKB4rSIeW6l_Tj4JHGjf0GC_HOn4B0HZ4iDaAB1VlSktbLW3aBxBmuANonWa1RRdD1QKQ'

    authorizer(
      {
        authorizationToken,
        methodArn: 'foo'
      },
      {},
      (err, res) => {
        expect(err).toEqual('Unauthorized')
        done()
      })
  })

  describe('invalid tokens', () => {
    [
      ['invalid Bearer token', 'Bearer foo'],
      ['invalid token', 'foo'],
      ['empty token', undefined]
    ].forEach(([title, authorizationToken]) => {
      test(title, done => {
        authorizer(
          {
            authorizationToken,
            methodArn: 'foo'
          },
          {},
          (err) => {
            expect(err).toEqual('Unauthorized')
            done()
          })
      })
    })
  })

  test('valid token', done => {
    const c = new CognitoIdentityServiceProvider({region: process.env.identity_pool_id.split(':')[0]})
    c
      .adminInitiateAuth({
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        ClientId: process.env.client_id,
        UserPoolId: process.env.user_pool_url.split('/').pop(),
        AuthParameters: {
          'USERNAME': process.env.username,
          'PASSWORD': process.env.password
        }
      })
      .promise()
      .then(({AuthenticationResult: {IdToken}}) => {
        authorizer(
          {
            authorizationToken: `Bearer ${IdToken}`,
            methodArn: 'foo'
          },
          {},
          (err, res) => {
            expect(err).toBeNull()
            expect(res).toHaveProperty('principalId')
            expect(res.context).toHaveProperty('cognitoIdentityId')
            expect(res.principalId).toEqual(res.context.cognitoIdentityId)
            expect(res.policyDocument).toEqual({
              'Version': '2012-10-17',
              'Statement': [
                {
                  'Action': 'execute-api:Invoke',
                  'Effect': 'Allow',
                  'Resource': 'foo'
                }
              ]
            })
            expect(res.context.email).toEqual(process.env.username)
            expect(res.context['cognito:username']).toEqual(process.env.username)
            done()
          })
      })
  })
})
