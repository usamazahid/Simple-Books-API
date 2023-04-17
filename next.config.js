/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env:{
    PGHOST:'ep-floral-tooth-206717.ap-southeast-1.aws.neon.tech',
    PGDATABASE:'neondb',
    PGUSER:'itsusamazahid',
    PGPASSWORD:'LD8dNIEzGK2i',
    SECRETKEY:'Welcome#1'
  }
}

module.exports = nextConfig
