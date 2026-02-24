import type { NextConfig } from 'next'

const removeImports = require('next-remove-imports')()

const nextConfig: NextConfig = {
  /* config options here */
}

export default removeImports(nextConfig)
