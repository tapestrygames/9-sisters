import { Position } from "../../../shared/types/coord";
import { Combatant } from "./combatant";

export type CombatantPredicate = (c: Combatant) => boolean;
export type CombatantUpdateFunc = (c: Combatant) => void;

export class CombatantList {
  private readonly _combatants: Combatant[];

  constructor(combatants: Combatant[]) {
    this._combatants = combatants;
  }

  public get combatants(): Combatant[] {
    return this._combatants;
  }
  public get length() {
    return this._combatants.length;
  }

  public get selectedCombatant(): Combatant | null {
    return this._firstOrNull((c: Combatant) => !!c.selected);
  }

  public update(func: CombatantUpdateFunc): void {
    this._combatants.forEach(func);
  }

  public map(func: CombatantUpdateFunc): CombatantList {
    return new CombatantList(
      this._combatants.map(c => {
        const c2 = JSON.parse(JSON.stringify(c));
        func(c2);
        return c2;
      })
    );
  }
  public filter(filter: CombatantPredicate): CombatantList {
    return new CombatantList(this._combatants.filter(filter));
  }

  public none(filter: CombatantPredicate): boolean {
    return this.filter(filter).length === 0;
  }

  public any(filter: CombatantPredicate): boolean {
    return this.filter(filter).length > 0;
  }

  public all(filter: CombatantPredicate): boolean {
    return this.filter(filter).length === this._combatants.length;
  }

  public copy(): CombatantList {
    return new CombatantList(JSON.parse(JSON.stringify(this._combatants)));
  }

  public first(filter: CombatantPredicate = () => true): Combatant {
    const filteredCombatants = this._combatants.filter(filter);
    if (!filteredCombatants.length) {
      throw new Error("attempt to call first on empty list");
    }
    return filteredCombatants[0];
  }

  public at(position: Position, pred: CombatantPredicate = () => true) {
    return this.firstOrNull(
      c => c.position.x === position.x && c.position.y === position.y && pred(c)
    );
  }

  public firstOrNull(
    filter: CombatantPredicate = () => true
  ): Combatant | null {
    const filteredCombatants = this._combatants.filter(filter);
    if (!filteredCombatants.length) {
      return null;
    }
    return filteredCombatants[0];
  }
  private _firstOrNull(
    filter: CombatantPredicate = c => true
  ): Combatant | null {
    const combatants = this._combatants.filter(filter);
    if (combatants.length > 0) {
      return combatants[0];
    }
    return null;
  }
}
