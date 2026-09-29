import type { NextConfig } from "next";

// The original MYTHRA site now lives under /un1; send old links there.
const movedRoutes = [
  "cast", "checkout", "collaborate", "filmmaker", "funnel-test", "genesis", "legal",
  "method", "path", "pricing", "stories", "studios", "you",
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...movedRoutes.flatMap((route) => [
        { source: `/${route}`, destination: `/un1/${route}`, permanent: false },
        { source: `/${route}/:rest*`, destination: `/un1/${route}/:rest*`, permanent: false },
      ]),
      { source: "/mythra-world.png", destination: "/un1/mythra-world.png", permanent: false },
    ];
  },
};

export default nextConfig;
