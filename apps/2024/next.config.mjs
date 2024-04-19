/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@knighthacks/api",
    "@knighthacks/ui",
    "@knighthacks/db",
    "@knighthacks/validators",
    "@knighthacks/consts",
  ],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
