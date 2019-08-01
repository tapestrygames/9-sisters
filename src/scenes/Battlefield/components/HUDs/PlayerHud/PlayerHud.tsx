import React, { Component } from "react";
import { Combatant } from "../../../types/combatant";

export interface PlayerHudProps {
  combatant: Combatant;
}

class PlayerHud extends Component<PlayerHudProps,{}> {
  render() {
    const {combatant } = this.props;
    return (
      <div className="md:border-black ui-corner-all bg-white shadow-lg p-5 flex flex-col">
        <div className="font-bold text-lg">{combatant.name}</div>
        <div>Movement Rate: {combatant.movementRate}</div>
        <div>Initiative: {combatant.initiative}</div>
      </div>
    );
  }
}

export default PlayerHud;