## Version 2.x.0 (2025-x-x)

### Features

- [ ] Allow the user to directly refresh the access token in a Vue template manually
- [ ] By importing `useJwt` from `@vueuse/integrations` we are forced to install all of `change-case drauu fuse.js idb-keyval sortablejs async-validator focus-trap jwt-decode nprogress qrcode` which is way too much. We only need `jwt-decode`
- [ ] Create the presets for auto-importing the global composables in Vite projects with `unplugin-auto-import`

## Version 2.1.0 (2025-10-30)

### Features

- [x] Track refs in the `query` parameter of composables automatically so that changes are reactive without manual intervention in the query parameters of the url

## Version 2.0.1 (2025-10-25)

### Features

- [x] Folders like `playground` and `tests` should be excluded from the package when published to npm

## Version 2.00.0-beta.2 (2025-10-23)

### Features

- [x] Add a `useUser` global composable to get the current authenticated user's ID
- [x] Add a `useAccessToken` global composable to return the access token in any Vue template

## Version 2.00.0-beta.1 (2025-10-15)

### Features

- [x] Fix package issue which does not create "dist" folder correctly
- [x] Refactor project types for better TypeScript support

## Version 1.00.0 (2025-07-08)

### useAsyncRequest

- [x] Add option to disable access token, refresh token or both token auto management (`disableAccess`, `disableRefresh`)
- [x] Add option to disable authentication all together (`disableAuth`)
