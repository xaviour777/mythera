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
  // The dragon egg experience is a static page in public/egg; serve it at /egg.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/egg", destination: "/egg/index.html" },
        { source: "/egg/", destination: "/egg/index.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: "/egg/:file((?:dragon|og|wa-card)\\.(?:webp|jpg))",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/egg/egg.js",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
