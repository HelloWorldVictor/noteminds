// This file configures OpenAPI documentation for the API.
// It loads generated OpenAPI components and paths, then registers them with the Elysia app.
import { ElysiaRouter, type ElysiaApp } from "./create-app";
import { openapi, fromTypes } from "@elysiajs/openapi";
import { OpenAPI } from "./auth";

export function configureOpenAPI(app: ElysiaRouter) {}
