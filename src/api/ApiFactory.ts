import { getSecurityHeaders } from "@/api/fetch-utils.ts";
import { BaseAPI, Configuration } from "@/api/generated/api-spec";
import { BASE_API_PATH, STATUS_INDICATORS } from "@/constants.ts";
import { useSnackbarStore } from "@/stores/snackbar";

type ApiCtor<T extends BaseAPI> = new (config: Configuration) => T;

interface ValidationErrorResponse {
  errors?: Record<string, string[]>;
  globalErrors?: string[];
}

const instances = new Map<ApiCtor<BaseAPI>, BaseAPI>();

async function customFetch(url: string, init?: RequestInit) {
  const customInit: RequestInit = {
    ...init,
    mode: "cors",
    credentials: "same-origin",
    redirect: "manual",
  };

  const response = await fetch(url, customInit);

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  return response;
}

async function handleErrorResponse(response: Response) {
  const snackbarStore = useSnackbarStore();

  if (response.status === 403) {
    snackbarStore.push({
      color: STATUS_INDICATORS.ERROR,
      text: "Sie haben nicht die nötigen Rechte um diese Aktion durchzuführen.",
    });

    return;
  }

  if (response.status === 400) {
    try {
      const body = (await response.clone().json()) as ValidationErrorResponse;

      const fieldMessages = Object.values(body.errors ?? {}).flat();
      const globalMessages = body.globalErrors ?? [];

      const messages = [...fieldMessages, ...globalMessages];

      for (const message of messages) {
        snackbarStore.push({
          color: STATUS_INDICATORS.ERROR,
          text: message,
        });
      }

      if (messages.length > 0) {
        return;
      }
    } catch {
      // Response enthält kein erwartetes JSON-Fehlerformat.
    }
  }

  snackbarStore.push({
    color: STATUS_INDICATORS.ERROR,
    text: "Es ist ein unbekannter Fehler aufgetreten.",
  });
}

function createConfig(): Configuration {
  return new Configuration({
    basePath: BASE_API_PATH,
    fetchApi: customFetch,
    middleware: [
      {
        pre: async (context) => {
          return {
            url: context.url,
            init: {
              ...context.init,
              headers: {
                ...context.init.headers,
                ...getSecurityHeaders(),
              },
            },
          };
        },
      },
    ],
  });
}

function getInstance<T extends BaseAPI>(ApiClass: ApiCtor<T>): T {
  const existing = instances.get(ApiClass);

  if (existing) {
    return existing as T;
  }

  const api = new ApiClass(createConfig());

  instances.set(ApiClass, api);

  return api;
}

export const ApiFactory = {
  getInstance,
} as const;
