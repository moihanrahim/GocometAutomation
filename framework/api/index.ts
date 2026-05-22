/**
 * Public API surface — import from `framework/api` only.
 */
export {
  ApiTestError,
  ReqResApiService,
  apiConfig,
  createReqResApi,
  getApiConfig,
  loadEndpointCatalog,
  resolveEndpointPath,
} from './reqres-api';

export type {
  ApiCallResult,
  ApiConfig,
  ApiKeyRole,
  EndpointCatalog,
  EndpointDefinition,
  HttpMethod,
  InvokeOptions,
  ResponseBody,
} from './reqres-api';
