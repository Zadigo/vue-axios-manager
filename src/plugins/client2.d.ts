import type { InternalEnpoints } from './types'

declare module 'vue' {
  interface GlobalComponents { }
  
  export interface ComponentCustomProperties {
    $axiosEndpoints: Record<string, InternalEnpoints>
  }
}

// normally this is only needed in .d.ts files
export {}
