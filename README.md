# Resonate

Quick start

1. Create a new codespace
2. Add your ngrok URL and Zoom app credentials to your [personal account secrets](https://github.com/settings/codespaces)
3. authenticate ngrok
4. run the app with docker-compose up
5. make port 8080 public
6. create an ngrok tunnel to port 8080

If you pull a new branch and it breaks:

1. run `npm install`
2. cd into `./apps/server` and run a db migration with: `npm run db:migrate:docker`

Additional Info:

- If you want to update `*.graphql` or `typedef.ts`, run `npm run codegen`
