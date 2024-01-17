/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['files.edgestore.dev'],
  },
  // NOTE:react-editor-js cannot work under reactStrictMode
  // TODO:We need someone to solve this problem
  reactStrictMode: false,
}

module.exports = nextConfig
