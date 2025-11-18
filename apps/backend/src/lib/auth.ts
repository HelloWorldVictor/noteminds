import { betterAuth } from "better-auth";
import { bearer, openAPI } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { env } from "@/lib/env";

const PATH = "/";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "mysql", "sqlite"
  }),
  basePath: PATH,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [openAPI(), bearer()],
  trustedOrigins: [
    // Chrome extensions
    "chrome-extension://fnonohdpcdffdfofkahbbblojfijpamd",
    // Firefox extensions
    "moz-extension://*",
    // Edge extensions
    "extension://*",
    // Safari extensions
    "safari-extension://*",
    // Development and local testing
    "http://localhost:*",
    "https://localhost:*",
  ],
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
  getPaths: (prefix = "/auth") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        const pathObj = paths[path];
        if (pathObj) {
          reference[key] = pathObj;

          for (const method of Object.keys(pathObj)) {
            const operation = (reference[key] as any)[method];
            if (operation) {
              operation.tags = ["Auth"];
            }
          }
        }
      }

      return reference;
    }) as Promise<any>,
  components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;
