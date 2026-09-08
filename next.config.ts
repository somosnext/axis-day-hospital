import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"], remotePatterns: [{ protocol: "https", hostname: "api.techealth.com.br" }, { protocol: "https", hostname: "www.drfredericofernandes.com.br" }, { protocol: "https", hostname: "vibrofit.com.br" }, { protocol: "https", hostname: "fagamed.com.br" }, { protocol: "https", hostname: "www.datocms-assets.com" }, { protocol: "https", hostname: "suckhoe123.vn" }, { protocol: "https", hostname: "images.dotmed.com" }, { protocol: "https", hostname: "i0.wp.com" }] },
  async headers() { return [{ source: "/(.*)", headers: [
    { key: "X-Content-Type-Options", value: "nosniff" }, { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }, { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ] }]; },
};

export default nextConfig;
