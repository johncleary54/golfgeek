# Solace Golf Geek

## Development

```
pnpm i -C client/
cp ./client/.env.example ./client/.env
docker-compose up --build
```

- App: http://localhost:3000
- PocketBase: http://localhost:8080/_/

## Production

```
git checkout release
git merge main
git push
```

- App: https://app.golfgeek.io
- PocketBase: https://app.golfgeek.io/pb/_/

## Pocketbase Gmail OAuth

ClientId: 1043695579290-o9tf5gp0shi3pona0pum8cictbssh3ob.apps.googleusercontent.com
ClientSecret: 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

## Architecture

- Frontend: SvelteKit
- Backend: PocketBase
- Server: Google Cloud Platform, e2-medium, hosted in Iowa
