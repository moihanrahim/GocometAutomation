/**
 * ReqRes API automation — unified service layer.
 * Config, catalog loading, HTTP client, logging, and status validation in one module.
 */
import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';
import { APIRequestContext, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type ApiKeyRole = 'manage' | 'public';

export interface ApiConfig {
  baseUrl: string;
  manageKey: string;
  publicKey: string;
  project: string;
  collection: string;
  recordsPath: string;
  env: string;
}

export interface EndpointDefinition {
  method: HttpMethod;
  path: string;
  query?: Record<string, string | number>;
  payload?: Record<string, unknown>;
  expectedStatus: number;
  key?: ApiKeyRole;
}

export interface EndpointCatalog {
  endpoints: Record<string, EndpointDefinition>;
  parameters: Record<string, (string | number)[]>;
}

export interface InvokeOptions {
  path?: string;
  pathParams?: Record<string, string | number>;
  query?: Record<string, string | number>;
  payload?: Record<string, unknown>;
  role?: ApiKeyRole;
  testName?: string;
}

/** Parsed JSON response — loose typing for test assertions */
export type ResponseBody = Record<string, unknown>;

export interface ApiCallResult {
  response: Awaited<ReturnType<APIRequestContext['fetch']>>;
  body: ResponseBody | null;
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class ApiTestError extends Error {
  constructor(
    message: string,
    public readonly testName: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'ApiTestError';
  }
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export function getApiConfig(): ApiConfig {
  const collection = process.env.REQRES_COLLECTION ?? 'products';
  return {
    baseUrl: process.env.API_BASE_URL ?? 'https://reqres.in',
    manageKey: process.env.REQRES_MANAGE_KEY ?? process.env.REQRES_API_KEY ?? '',
    publicKey: process.env.REQRES_PUBLIC_KEY ?? '',
    project: process.env.REQRES_PROJECT ?? 'cool-ocean-api-67',
    collection,
    recordsPath: `/api/collections/${collection}/records`,
    env: process.env.REQRES_ENV ?? 'off',
  };
}

/** @deprecated Use getApiConfig() — kept for playwright.config.ts */
export const apiConfig = getApiConfig();

// ---------------------------------------------------------------------------
// Endpoint catalog (YAML)
// ---------------------------------------------------------------------------

export function loadEndpointCatalog(filePath: string): EndpointCatalog {
  const absolute = path.resolve(filePath);
  if (!fs.existsSync(absolute)) {
    throw new ApiTestError(`Endpoints file not found: ${absolute}`, 'catalog');
  }

  const raw = parse(fs.readFileSync(absolute, 'utf8')) as Record<string, unknown>;
  const { parameters = {}, ...rest } = raw;
  const endpoints: Record<string, EndpointDefinition> = {};

  for (const [key, value] of Object.entries(rest)) {
    if (key === 'parameters' || typeof value !== 'object' || value === null) continue;
    const cfg = value as EndpointDefinition;
    if (!cfg.method || !cfg.path || cfg.expectedStatus === undefined) {
      throw new ApiTestError(`Invalid endpoint "${key}"`, 'catalog');
    }
    endpoints[key] = cfg;
  }

  return {
    endpoints,
    parameters: (parameters ?? {}) as Record<string, (string | number)[]>,
  };
}

export function resolveEndpointPath(
  template: string,
  pathParams: Record<string, string | number>
): string {
  let resolved = template;
  for (const [key, value] of Object.entries(pathParams)) {
    resolved = resolved.replace(`{${key}}`, String(value));
  }
  return resolved;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class ReqResApiService {
  private readonly config: ApiConfig;

  constructor(
    private readonly request: APIRequestContext,
    config?: ApiConfig
  ) {
    this.config = config ?? getApiConfig();
  }

  /** Load catalog from endpoints.yml (alias for loadEndpointCatalog). */
  static loadCatalog(filePath: string): EndpointCatalog {
    return loadEndpointCatalog(filePath);
  }

  static resolvePath = resolveEndpointPath;

  async invoke(
    endpoint: EndpointDefinition,
    options: InvokeOptions = {}
  ): Promise<ApiCallResult> {
    const resolvedPath = this.buildPath(endpoint, options);
    const method = endpoint.method;
    const testName = options.testName ?? method;

    this.log('step', `${method} ${resolvedPath}`);

    let response;
    try {
      response = await this.request.fetch(resolvedPath, {
        method,
        headers: this.buildHeaders(options.role ?? endpoint.key ?? 'public'),
        data: options.payload ?? endpoint.payload,
        params: options.query ?? endpoint.query,
      });
    } catch (error) {
      this.log('error', `Request failed: ${method} ${resolvedPath}`, error);
      throw new ApiTestError('HTTP request failed', testName, error);
    }

    const bodyText = await response.text();
    const body: ResponseBody | null = bodyText
      ? (JSON.parse(bodyText) as ResponseBody)
      : null;
    this.log('info', `Response ${response.status()} (${bodyText.length} bytes)`);
    this.assertStatus(response.status(), endpoint.expectedStatus, testName);

    return { response, body };
  }

  private buildPath(endpoint: EndpointDefinition, options: InvokeOptions): string {
    let resolved = options.path ?? endpoint.path;
    const params = options.pathParams ?? {};
    for (const [key, value] of Object.entries(params)) {
      resolved = resolved.replace(`{${key}}`, String(value));
    }
    return resolved;
  }

  private buildHeaders(role: ApiKeyRole): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const apiKey = role === 'public' ? this.config.publicKey : this.config.manageKey;
    if (apiKey) headers['x-api-key'] = apiKey;
    if (role === 'manage' && this.config.env && this.config.env !== 'off') {
      headers['X-Reqres-Env'] = this.config.env;
    }
    return headers;
  }

  private assertStatus(actual: number, expected: number, testName: string): void {
    try {
      expect(actual, `${testName}: status code`).toBe(expected);
    } catch (error) {
      throw new ApiTestError(
        `Expected status ${expected}, got ${actual}`,
        testName,
        error
      );
    }
  }

  private log(
    level: 'info' | 'step' | 'error',
    message: string,
    detail?: unknown
  ): void {
    const ts = new Date().toISOString();
    const line = `[${ts}] [${level.toUpperCase()}] ${message}`;
    if (level === 'error') console.error(line, detail ?? '');
    else console.log(line);
  }
}

export function createReqResApi(request: APIRequestContext): ReqResApiService {
  return new ReqResApiService(request);
}
