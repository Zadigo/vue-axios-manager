/* eslint-disable @typescript-eslint/no-empty-object-type */

import { vueAxiosManager } from './lib/manager'

import type { InternalEnpointOptions } from './lib/types'

declare global {
  interface Window {
    VueAxiosManager?: typeof vueAxiosManager
  }
}

declare module 'vue' {
  interface GlobalComponents { }

  export interface ComponentCustomProperties {
    $axiosEndpoints: Record<string, InternalEnpointOptions>
  }
}

// normally this is only needed in .d.ts files
export { }
