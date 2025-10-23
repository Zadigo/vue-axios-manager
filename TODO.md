## Version 2.00.0-beta.2 (2025-10-30)

### Features

- [ ] Add a `useUserId` global composable to get the current authenticated user's ID
- [ ] Add a `useAccessToken` global composable to return the access token in any Vue template
- [ ] Allow the user to directly refresh the access token in a Vue template manually

## Version 2.00.0-beta.1 (2025-10-15)

### Features

- [x] Fix package issue which does not create "dist" folder correctly
- [x] Refactor project types for better TypeScript support

## Version 1.00.0 (2025-07-08)

### useAsyncRequest

- [x] Add option to disable access token, refresh token or both token auto management (`disableAccess`, `disableRefresh`)
- [x] Add option to disable authentication all together (`disableAuth`)
