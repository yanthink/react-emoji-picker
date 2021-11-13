import React from 'react';
import emojiToolkit from 'emoji-toolkit';
import type { EmojiToolkitOptions } from './emoji-toolkit';
import type { Emoji } from './utils';
import styles from './style.less';

export interface EmojiItemProps {
  emojiToolkit?: Partial<EmojiToolkitOptions>;
  emoji: Partial<Emoji> & { shortname: Emoji['shortname'] };
  size: number;
  onSelect?: (emoji: EmojiItemProps['emoji']) => void;
}

const EmojiItem: React.FC<EmojiItemProps> = props => {
  const createMarkup = () => {
    const originalEmojiToolkitOptions = Object.entries(props.emojiToolkit || {})
      .reduce((options, [key]) => Object.assign(options, { [key]: emojiToolkit[key] }), {});

    const html = Object.assign(emojiToolkit, props.emojiToolkit).shortnameToImage(props.emoji.shortname || '');

    Object.assign(emojiToolkit, originalEmojiToolkitOptions);

    return { __html: html };
  };

  const padding = props.size * .2;
  const emojiSize = Number(props.emojiToolkit?.sprites ? props.emojiToolkit?.spriteSize : props.emojiToolkit?.emojiSize || 32);
  const scale = (props.size - padding * 2) / emojiSize;

  return (
    <div
      className={styles.emojiItem}
      onKeyUp={() => props.onSelect?.(props.emoji)}
      onClick={() => props.onSelect?.(props.emoji)}
      style={{
        width: props.size,
        height: props.size,
        padding,
      }}
    >
      <div
        style={{
          width: emojiSize,
          height: emojiSize,
          transform: `scale(${scale}, ${scale})`,
          transformOrigin: 'left top',
        }}
        dangerouslySetInnerHTML={createMarkup()}
      />
    </div>
  );
};

export default EmojiItem;
