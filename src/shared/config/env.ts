const getEnvVar = (key: string, fallback: string): string =>
  import.meta.env[key] ? String(import.meta.env[key]) : fallback

export const env = {
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', '/api'),
} as const
