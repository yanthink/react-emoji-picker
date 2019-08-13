import React, {Component} from "react";
// @ts-ignore
import shallowCompare from "react-addons-shallow-compare";
import Emoji from "./Emoji";
import {EmojiType} from "./uitls";


export interface EmojiRowProps {
  emojis: EmojiType[];
  onSelect: (emoji: EmojiType) => void;
  style: Object;
}

export default class EmojiRow extends Component<EmojiRowProps> {
  shouldComponentUpdate(nextProps: EmojiRowProps, nextState: any) {
    return shallowCompare(this, nextProps, nextState);
  }

  handleEmojiSelect = (e: any, emoji: any) => {
    this.props.onSelect(emoji);
  };

  render() {
    const {emojis, style} = this.props;

    return (
      <div className="emoji-row" style={style}>
        {emojis.map((emoji) => (
          <Emoji
            emoji={emoji}
            ariaLabel={emoji.name}
            role="option"
            key={emoji._key}
            onSelect={this.handleEmojiSelect}
          />
        ))}
      </div>
    );
  }
}
