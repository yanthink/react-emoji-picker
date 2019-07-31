import React, {Component} from "react";
// @ts-ignore
import emojiToolkit from "emoji-toolkit";

export interface EmojiProps {
  emoji: { shortname: string };
  ariaLabel?: string;
  role?: string;
  onSelect?: (e: any, emoji: any) => void;
}

export default class Emoji extends Component<EmojiProps> {
  createMarkup() {
    return {__html: emojiToolkit.shortnameToImage(this.props.emoji.shortname)};
  }

  handleKeyUp = (e: any) => {
    e.preventDefault();
    if (e.key === "Enter" || e.key === " ") {
      this.handleClick(e);
    }
  };

  handleClick = (e: any) => {
    const {onSelect, emoji} = this.props;
    if (onSelect) {
      onSelect(e, emoji);
    }
  };

  render() {
    return (
      <div
        onKeyUp={this.handleKeyUp}
        onClick={this.handleClick}
        aria-label={this.props.ariaLabel}
        role={this.props.role}
        className="emoji"
        dangerouslySetInnerHTML={this.createMarkup()}
      />
    );
  }
}
