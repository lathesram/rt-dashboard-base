import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'order_summary',
  exposes: {
    './Routes': 'apps/order_summary/src/app/remote-entry/entry.routes.ts',
  },
  shared: (name, config) => {
    // Share NgRx as singletons across all MFEs
    if (name.startsWith('@ngrx/')) {
      return { singleton: true, strictVersion: true, requiredVersion: 'auto' };
    }
    // Share our custom library as singleton
    if (name.startsWith('@rt-dashboard/')) {
      return { singleton: true, strictVersion: false, requiredVersion: false };
    }
    return config;
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
