import React, { useState } from 'react';
import type { EmojiItemProps } from 'yt-emoji-picker/dist/EmojiItem';
import YtEmojiPicker from 'yt-emoji-picker';
import emojiToolkit from 'emoji-toolkit';
import './app.css';
import 'yt-emoji-picker/dist/style.css';
import 'emoji-assets/sprites/joypixels-sprite-32.min.css';

// 全局设置
emojiToolkit.sprites = true; // sprites = true 需要引入 emoji-asset 对应的 css 样式
emojiToolkit.spriteSize = '32';

function App() {
  const [emoji, setEmoji] = useState<EmojiItemProps['emoji']>();
  console.info(emoji);

  return (
    <div className="container">
      <YtEmojiPicker
        // sprites = true 需要引入 emoji-asset 对应的 css 样式
        emojiToolkit={{ sprites: true, spriteSize: '32' }}
        onSelect={setEmoji}
        // 启用搜索，搜索规则是 匹配 shortname、shortname_alternates、ascii 和 keywords 字段
        search
      />
      {emoji && (
        <div className="preview" >
          <div>shortname：{emoji.shortname}</div>
          <div>unicode：{emojiToolkit.shortnameToUnicode(emoji.shortname)}</div>
          <div>emoji：<span dangerouslySetInnerHTML={{ __html: emojiToolkit.shortnameToImage(emoji.shortname) }} /></div>
        </div>
      )}
    </div>
  );
}

export default App;
