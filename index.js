'use strict'

const https = require('https')
const {CognitoIdentity} = require('aws-sdk')
const {verify} = require('jsonwebtoken')
const jwkToPem = require('jwk-to-pem')

const ci = new CognitoIdentity()

const jwks = {}

const fetchJWKs = (issuer) => {
  const jwkLocation = `${issuer}/.well-known/jwks.json`
  if (!jwks[jwkLocation]) {
    jwks[jwkLocation] = new Promise((resolve, reject) => {
      https.get(jwkLocation, res => {
        try {
          const {statusCode} = res
          if (statusCode !== 200) {
            throw new Error(`Failed to fetch ${jwkLocation}: ${statusCode}!`)
          }
          res.setEncoding('utf8')
          let rawData = ''
          res.on('data', (chunk) => {
            rawData += chunk
          })
          res.on('end', () => {
            const keys = JSON.parse(rawData).keys
            resolve(keys.map(key => ({
              ...key,
              pem: jwkToPem({kty: key.kty, n: key.n, e: key.e})
            })))
          })
        } catch (err) {
          return reject(err)
        } finally {
          res.resume()
        }
      })
    })
  }
  return jwks[jwkLocation]
}

exports.handler = (event, context, callback) => {
  const token = event.authorizationToken

  const [header64, payload64] = token.split('.')
  const {kid: tokenKid} = JSON.parse(Buffer.from(header64, 'base64'))
  const {iss, token_use: use} = JSON.parse(Buffer.from(payload64, 'base64'))

  if (iss !== process.env.user_pool_url) {
    return callback(new Error(`Invalid issuer: ${iss}!`))
  }

  if (use !== 'id') {
    return callback(new Error(`Must provide an "id" token.`))
  }

  fetchJWKs(iss)
    .then(jwks => {
      const {pem, alg} = jwks.find(({kid}) => kid === tokenKid)
      if (!pem) {
        throw new Error(`Invalid kid "${tokenKid}"!`)
      }
      return new Promise((resolve, reject) => {
        verify(token, pem, {algorithms: [alg]}, (err, payload) => {
          if (err) return reject(err)
          return resolve(payload)
        })
      })
    })
    .then(payload => ci
      .getId({
        IdentityPoolId: process.env.identity_pool_id,
        Logins: {
          [payload.iss.replace(/^https:\/\//, '')]: token
        }
      })
      .promise()
      .then(({IdentityId}) => callback(null, {
        principalId: IdentityId,
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource: event.methodArn
            }
          ]
        },
        context: {
          user: IdentityId,
          email: payload.email,
          'cognito:username': payload['cognito:username']
        }
      })))
    .catch(callback)
}
