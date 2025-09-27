---
outline: deep
---

Endpoints are used to send requests to an API via builtin composables.

__Endpoint options__

Descriptive list of options used for the endpoint parameter:

`name`

Unique name used to identify the endpoint to be called

`label`

Additonal descriptive label for the endpoint

`dev`

Domain used for the endpoint

`port`

Domains generally have a port. The default one is 8000

`domain`

Domain to use in a producton context

`accessEndpoint`

Path used to generated an access token

`refreshEnpoint`

Path used to generated an refresh token

`https`

Whether to use the development domain in https

`accessKey`

Unique identifier under which to store the access token

`refreshKey`

Unique identifier under which to store the refresh token

`disableAccess`

Whether to disable access token

`disableRefresh`

Whether to disable refresh token

`axios`

Options passed directly to Axios

`bearer`

The key to use in the Authorization header

`disableAuth`

Whether to disable authentication entirely
