# Raindrop.io

```
Development inprogress
```

## Raindrop Auth

Register you app (https://app.raindrop.io/settings/integrations).

```ts
let rd = new RaindropAuth(
  clientId,
  clientSecret
);

// Redirect to this url
rd.getAuthorizationRequestUrl();

// Pass code from returned url and get access token
let r = await rd.getRefreshToken("code");
```

## Raindrop API

Only following function implemented.

```ts
getRootCollections()
getChildCollections()
getCollection(id: number)
getSystemCollectionsCount()
getRaindrops(collectionId: number)
getRaindrop(id: number)
```
