import { expect } from "@hapi/code";
import * as Lab from "@hapi/lab";
import { createGame } from "./game";
import { GameWaitingForPlayerToJoin, Player, State } from "./types/game";

const lab = Lab.script();
const { describe, it } = lab;
export { lab };

describe("Game logic", () => {
  describe("Create game", () => {
    it("Creates a new game", () => {
      const id = "123";
      const player: Player = { name: "Rickard" };

      const expected: GameWaitingForPlayerToJoin = {
        id,
        state: State.WaitingForPlayerToJoin,
        players: [player],
        moves: [],
        result: undefined,
      };

      expect(createGame(id, player)).to.equal(expected);
    });
  });
});
