/**
 * Type declarations for Nuxt auto-imports in server context
 * These are provided by Nuxt at runtime but need to be declared for TypeScript
 */

import type { H3Event } from 'h3';

declare global {
  /**
   * Define an event handler for Nitro/H3
   */
  function defineEventHandler<T>(
    handler: (event: H3Event) => T | Promise<T>,
  ): (event: H3Event) => T | Promise<T>;

  /**
   * Read and parse the request body
   */
  function readBody<T = unknown>(event: H3Event): Promise<T>;

  /**
   * Create an HTTP error
   */
  function createError(options: {
    statusCode?: number;
    statusMessage?: string;
    message?: string;
    data?: unknown;
  }): Error;

  /**
   * Get the runtime configuration
   */
  function useRuntimeConfig(): {
    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    smtpPass: string;
    agencyEmail: string;
    agencyPhone: string;
    agencyAddress: string;
    agencyWebsite: string;
    agencyNpn: string;
    supabaseUrl: string;
    supabaseKey: string;
    public: {
      siteUrl: string;
      agencyEmail: string;
      agencyPhone: string;
      agencyAddress: string;
      agencyWebsite: string;
      agencyNpn: string;
    };
  };

  /**
   * Get query parameters from the event
   */
  function getQuery(event: H3Event): Record<string, string | string[]>;
}
