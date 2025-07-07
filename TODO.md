## TODO

- [] Does not work in the `onMounted` wrapper of the setup


### useAyncRequest

When trying to send a request with use async in "immediate", the app in useRequest is "undefined"

- [] This might be due to the fact of using a composable within a composable ??
- [] This might be due to the useDebounceFn


### VueAxiosManager

- [] Centralize essential parts of the application (like options, endpoints) into a class so that other parts of the application can access them
- [] Refactor some of the functions in RequestStore into this class
