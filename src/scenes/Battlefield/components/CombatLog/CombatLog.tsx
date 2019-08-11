import React, { Component } from "react";
import "./CombatLog.css";

export interface CombatLogProps {
  logEntries: string[]
}

class CombatLog extends Component<CombatLogProps, {}> {
  public render() {
    const { logEntries} = this.props;
    return (
      <div className="combat-log">
        {logEntries.map((e,i) => <div key={i}>{e}</div>)}
      </div>
    );
  }
}

export default CombatLog;