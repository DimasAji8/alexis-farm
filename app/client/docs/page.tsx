"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const SPEC_URL = "/api/docs";

type SwaggerUIBundleType = (options: {
  url: string;
  dom_id: string;
  presets?: unknown[];
  layout?: string;
}) => void;

type SwaggerGlobals = typeof globalThis & {
  SwaggerUIBundle?: SwaggerUIBundleType & { presets: { apis: unknown } };
  SwaggerUIStandalonePreset?: unknown;
};

export default function ApiDocsPage() {
  const [swaggerReady, setSwaggerReady] = useState(false);

  useEffect(() => {
    const swaggerGlobals = globalThis as SwaggerGlobals;

    if (!swaggerReady) return;
    if (!swaggerGlobals.SwaggerUIBundle || !swaggerGlobals.SwaggerUIStandalonePreset) return;

    swaggerGlobals.SwaggerUIBundle({
      url: SPEC_URL,
      dom_id: "#swagger-ui",
      presets: [swaggerGlobals.SwaggerUIBundle.presets.apis, swaggerGlobals.SwaggerUIStandalonePreset],
      layout: "StandaloneLayout",
    });
  }, [swaggerReady]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css"
      />
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-2xl font-semibold text-slate-900">API Docs</h1>
          <p className="text-sm text-slate-600">Swagger UI untuk endpoint Alexis Farm.</p>
        </div>
        <div id="swagger-ui" className="bg-white shadow-sm ring-1 ring-slate-200" />
      </div>
      <Script
        src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"
        strategy="afterInteractive"
        onLoad={() => setSwaggerReady(true)}
      />
      <Script
        src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-standalone-preset.js"
        strategy="afterInteractive"
        onLoad={() => setSwaggerReady(true)}
      />
    </>
  );
}
