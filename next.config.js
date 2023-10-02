/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  serverComponentsExternalPackage: ["mongoose"],
  images: {
    domains: ['images.unsplash.com'], // Add the allowed domain(s) here
  },
}

module.exports = nextConfig
