import React, { Component } from 'react';
import { map } from 'lodash';

export interface ModifiersProps {
  active: number;
  onChange: (modifier: number) => void;
}

const modifiers: { [index: number]: string } = {
  0: "#FFDE5C",
  1: "#FFE1BB",
  2: "#FFD0A9",
  3: "#D7A579",
  4: "#B57D52",
  5: "#8B6858",
};

export default class Modifiers extends Component<ModifiersProps> {
  handleModifierClick = (modifier: number) => {
    this.props.onChange(modifier);
  };

  render() {
    return (
      <ol className="modifiers">
        {map(modifiers, (hex, modifier: number) => (
          <li key={modifier}>
            <a
              onClick={() => this.handleModifierClick(modifier)}
              className={Number(this.props.active) === Number(modifier) ? "modifier active" : "modifier"}
              style={{ background: hex }}
              aria-label={`Fitzpatrick type ${modifier}`}
            />
          </li>
        ))}
      </ol>
    );
  }
}
