/**
* This file is for terraform build, for creating variables according to env variables

example trying to run this locally from terminal:

HT_REGION=us-west-2 \
HT_API_CDN_ENDPOINT=devnadav-api.htdev.hypertrack.com \
HT_APP_ENV=devnadav \
HT_VPC_NAME=htdev \
HT_GRAPHQL_API_KEY=da2-u57mowxkvbcxnnohq4ah4romem \
HT_GRAPHQL_ENDPOINT=https://kgwmzi4glnaoxbhuahuef3lcwu.appsync-api.us-west-2.amazonaws.com/graphql \
AWS_REGION=us-west-2 \
HT_STRIPE_API_KEY=example \
HT_COGNITO_POOL_CLI_ID=5fjtbeau5n1ued8ndapgo23gmr \
HT_COGNITO_POOL_ID=us-west-2_m1r5Z6FcW \
CODEBUILD_RESOLVED_SOURCE_VERSION=37c1ad67fe30f6a628ea80efa08043ba0e46981d
 node src/constants/constants-builder.js

*/

// Short commit is 37c1ad67

const fs = require('fs')

const keys = [
  'CODEBUILD_RESOLVED_SOURCE_VERSION',
  'HT_APP_ENV',
  'HT_VPC_NAME',
  'HT_API_CDN_ENDPOINT',
  'HT_COGNITO_POOL_ID',
  'HT_GRAPHQL_API_KEY',
  'HT_REGION',
  'HT_STRIPE_API_KEY',
  'HT_COGNITO_POOL_CLI_ID',
  'HT_GRAPHQL_ENDPOINT'
  // 'HT_FQDN_DASHBOARD',
  // 'HT_FQDN_EMBED',
  // 'HT_FQDN_TRACK'
]

//trust but verify
keys.forEach(k => {
  //    console.log(k, process.env[k])
  if (!process.env[k]) {
    console.log(`Error: Config build failed - required parameter missing: ${k}`)
    process.exit(1)
  }
})

let template = {
  appsync: {
    apiKey: process.env.HT_GRAPHQL_API_KEY,
    authenticationType: 'API_KEY',
    graphqlEndpoint: process.env.HT_GRAPHQL_ENDPOINT,
    region: process.env.HT_REGION
  },
  auth: {
    isDev: false,
    region: process.env.HT_REGION,
    userPoolId: process.env.HT_COGNITO_POOL_ID,
    userPoolWebClientId: process.env.HT_COGNITO_POOL_CLI_ID
  },
  fqdns: {
    // dashboard: process.env.HT_FQDN_DASHBOARD,
    // embed: process.env.HT_FQDN_EMBED,
    // track: process.env.HT_FQDN_TRACK
  },
  stripe: {
    pk: process.env.HT_STRIPE_API_KEY
  },
  baseURL: `https://${process.env.HT_API_CDN_ENDPOINT}`,
  buildCommit: process.env.CODEBUILD_RESOLVED_SOURCE_VERSION.substring(0, 8)
}

if (process.env.SENTRY_DSN) template.sentryDSN = process.env.SENTRY_DSN

const configfile = `src/constants/constants.${process.env.HT_APP_ENV}.json`

fs.writeFile(configfile, JSON.stringify(template, null, 2), function(err) {
  if (err) {
    return console.log(err)
  }
  console.log('~~> new config variables file was saved!', configfile)
})
