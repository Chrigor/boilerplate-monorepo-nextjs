import { HttpClient } from "./client.http";

export function makeHttpClient(): HttpClient {
  return new HttpClient({
    baseURL: process.env.API_BASE_URL ?? "http://localhost:3000",
  });
}
