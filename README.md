# Custom API Gateway Authorizer

[![npm version](https://img.shields.io/npm/v/@nrfcloud/api-gateway-authorizer.svg)](https://www.npmjs.com/package/@nrfcloud/api-gateway-authorizer)
[![Greenkeeper badge](https://badges.greenkeeper.io/nrfcloud/api-gateway-authorizer.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Build Status](https://travis-ci.org/nRFCloud/api-gateway-authorizer.svg?branch=master)](https://travis-ci.org/nRFCloud/api-gateway-authorizer)
[![Greenkeeper badge](https://badges.greenkeeper.io/nRFCloud/api-gateway-authorizer.svg)](https://greenkeeper.io/)
[![DeepScan Grade](https://deepscan.io/api/projects/1710/branches/7383/badge/grade.svg)](https://deepscan.io/dashboard/#view=project&pid=1710&bid=7383)
[![Known Vulnerabilities](https://snyk.io/test/github/nrfcloud/api-gateway-authorizer/badge.svg)](https://snyk.io/test/github/nrfcloud/api-gateway-authorizer)
[![Maintainability](https://api.codeclimate.com/v1/badges/7d5bd4bef1a93572dd3f/maintainability)](https://codeclimate.com/github/nRFCloud/api-gateway-authorizer/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/7d5bd4bef1a93572dd3f/test_coverage)](https://codeclimate.com/github/nRFCloud/api-gateway-authorizer/test_coverage)

Authorizes requests to the nRF Cloud API with Cognito Tokens.

## Tests

Set these environment variables:

    user_pool_url=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_fdiBa7JSO
    identity_pool_id=us-east-1:c00e1327-dfc2-4aa7-a484-8ca366d11a68
    username=user@example.com
    password=changeme
    client_id=bmoej5j8t187jmnumu00jrt2v
