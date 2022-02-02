# Rock Paper Scissors game

A Rock Paper Scissors game written with Hapi.js in TypeScript.

Game developed and tested by Rickard Lindahl <mail@rickardlindahl.com> using;

- `node v16.13.1`
- `npm 8.1.2`

Before running the server of developing make sure to download the dependencies.

```shell
npm ci
```

## Starting the server

Start the server by running:

```shell
npm run start
```

This will run the typescript compiler and output to `dist` before starting the server with `node`.

## Playing the game

Make sure the server is up and running.

**Step 1** - Create a game

```sh
curl -X POST http://localhost:3000/api/games \
   -H 'Content-Type: application/json' \
   -d '{ "name": "Pelle" }'
```

The server will respond with a game id you can send to your opponent.

**Step 2** - Join the game

Limits: The name of the opponent must be unique - it can't be the same as the player who created the game.

Replace `{id}` with the id from step 1:

```sh
curl -X POST http://localhost:3000/api/games/{id}/join \
   -H 'Content-Type: application/json' \
   -d '{ "name": "Lisa" }'
```

The server will respond with the current state of the game.

**Step 3** - Make a move:

Valid moves: `"ROCK"`, `"PAPER"`, `"SCISSORS"`

It does not matter which player makes the first move, as long as the name of the player is a part of the created game.

Replace `{id}` with the id from step 1:

```sh
curl -X POST http://localhost:3000/api/games/{id}/move \
   -H 'Content-Type: application/json' \
   -d '{ "name": "Pelle", "move": "ROCK" }'
```

The server will respond with the current state of the game, except the move just made.

**Step 4** - Make a (second) move:

Valid moves: `"ROCK"`, `"PAPER"`, `"SCISSORS"`

Replace `{id}` with the id from step 1:

```sh
curl -X POST http://localhost:3000/api/games/{id}/move \
   -H 'Content-Type: application/json' \
   -d '{ "name": "Lisa", "move": "SCISSORS" }'
```

The server will respond with the final state of the game.

**Step 5** - Get the state of the game to see the result (optional for the player making the second move)

```sh
curl -X GET http://localhost:3000/api/games/{id}
```

The server will respond with the final state of the game.

The output will include the following to determine who won:

```
{
   ...
   result: {
      outcome: "DRAW" | "WINNER",
      winner: outcome == "WINNER" ? player : null
   }
}
```

Have fun!

### Limitations

No user validation is in place - you can make a move as any player as long as they are part of the game.

## Developing

Start the development server by running:

```shell
npm run dev
```

`nodemon` is used to watch for changes and restart the server.

The game storage is in-memory only so it will be cleared on file change when running the sever in development mode.

## Tests

Run the test by running:

```shell
npm run test
```

Or in watch mode:

```shell
npm run watch:test
```
