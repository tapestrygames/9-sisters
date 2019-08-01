import React, { Component } from "react";
import "./CombatLog.css";

export interface CombatLogProps {
  entries: string[]
}

class CombatLog extends Component<CombatLogProps, {}> {
  public render() {
    const { entries} = this.props;
    return (
      <div className="combat-log">
        {entries.map((e,i) => <div key={i}>{e}</div>)}
      </div>
    );
  }
}

export default CombatLog;