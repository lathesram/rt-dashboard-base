import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'shell',
  /**
   * To use a remote that does not exist in your current Nx Workspace
   * You can use the tuple-syntax to define your remote
   *
   * remotes: [['my-external-remote', 'https://nx-angular-remote.netlify.app']]
   *
   * You _may_ need to add a `remotes.d.ts` file to your `src/` folder declaring the external remote for tsc, with the
   * following content:
   *
   * declare module 'my-external-remote';
   *
   */
  remotes: [
    ['order_producer', 'http://localhost:4201'],
    ['order_list', 'http://localhost:4202'],
    ['order_summary', 'http://localhost:4203'],
  ],
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
