

/**
 * @description
 * windown config host
127.0.0.1       api.example.com auth.example.com dc.example.com example.com docs.example.com

 */

const DOMIAINS_TEST = {
  // example.com
  API: 'http://api.example.com:8000',
  // apps
  AUTH: 'http://auth.example.com:3000',
  DC: 'http://dc.example.com:3001',
  // web
  WEB: 'http://example.com:4000',
  DOCS: 'http://docs.example.com:4001',
  
}

const DOMIAINS_PROD = {
  // cloudbit.app
  API: 'https://api.cloudbit.app',
  // apps
  AUTH: 'https://auth.cloudbit.app',
  DC: 'https://dc.cloudbit.app',
  // web
  WEB: 'https://cloudbit.app',
  DOCS: 'https://docs.cloudbit.app',
}

export const DOMIAINS = process.env.NODE_ENV === 'production' ? DOMIAINS_PROD : DOMIAINS_TEST


// domain cookies

export const COOKIE_DOMAIN = process.env.NODE_ENV === 'production' ? '.cloudbit.app' : '.example.com'
