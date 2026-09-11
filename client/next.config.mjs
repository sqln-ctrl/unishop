/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/api/[[...path]]": ["./server/prisma/dev.db"],
  },
};

export default nextConfig;
