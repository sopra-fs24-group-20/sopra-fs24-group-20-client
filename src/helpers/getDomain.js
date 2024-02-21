import { isProduction } from "./isProduction"

/**
 * This helper function returns the current domain of the API.
 * If the environment is production, the production App Engine URL will be returned.
 * Otherwise, the link localhost:8080 will be returned (Spring server default port).
 * @returns {string}
 */
export const getDomain = () => {
  const prodUrl = "https://console.cloud.google.com/cloud-build/builds;region=europe-west6/d9ea0b7a-cc4a-4261-91aa-6f3bc19c504f?project=sopra-fs24-mirwei-server" // TODO: insert your prod url for server (once deployed)
  const devUrl = "http://localhost:8080"

  return isProduction() ? prodUrl : devUrl
}
