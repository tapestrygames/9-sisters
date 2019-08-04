import { expect } from "chai";
import { testCombatants } from "../../../shared/testdata";
import { Combatant, Faction } from "./combatant";
import { CombatantList } from "./CombatantList";

describe("combatantList", () => {
  let combatants: CombatantList = new CombatantList([]);

  beforeEach(() => {
    combatants = testCombatants.copy();
  });

  describe("length", () => {
    it("should return the proper length", () => {
      expect(combatants.length).to.equal(5);
    });
  });

  describe("filters", () => {
    it("should filter on a predicate", () => {
      const c2 = combatants.filter(c => c.faction === Faction.ENEMY);
      expect(c2.length).to.equal(3);
    });
  });
  describe("any", () => {
    it("should see if there are any matches", () => {
      const c2 = combatants.any(c => c.faction === Faction.ENEMY);
      expect(c2).to.equal(true);
    });
    it("...and return false if there aren't", () => {
      const c2 = combatants.any(c => c.movementRate > 100);
      expect(c2).to.equal(false);
    });
  });
  describe("none", () => {
    it("should see if there are no matches", () => {
      const c2 = combatants.none(c => c.movementRate > 100);
      expect(c2).to.equal(true);
    });
    it("...and return false if there are", () => {
      const c2 = combatants.none(c => c.faction === Faction.ENEMY);
      expect(c2).to.equal(false);
    });
  });
  describe("all", () => {
    it("should see if everything matches", () => {
      const c2 = combatants.all(c => c.movementRate > 0);
      expect(c2).to.equal(true);
    });
    it("...and return false if they all don't", () => {
      const c2 = combatants.all(c => c.faction === Faction.ENEMY);
      expect(c2).to.equal(false);
    });
  });
  describe("update/map", () => {
    it("should update values for all", () => {
      combatants.update(c => (c.movementRate = 42));
      expect(combatants.all(c => c.movementRate === 42)).to.equal(true);
    });
    it("should update values for all", () => {
      const c2 = combatants.map(c => (c.movementRate = 42));
      expect(combatants.all(c => c.movementRate < 42)).to.equal(true);
      expect(c2.all(c => c.movementRate === 42)).to.equal(true);
    });
  });
  describe("first", () => {
    it("should find first matching", () => {
      const c: Combatant = combatants.first(cc => cc.name === "Dhrami");
      expect(c.name).to.equal("Dhrami");
    });
    it("should throw if no match", () => {
      expect(() => combatants.first(c => c.name === "Ramone")).to.throw();
    });
  });
});
