import React from 'react';
import EmojiPicker from 'yt-emoji-picker';
import 'yt-emoji-picker/dist/style.css';

function App () {
  const emojiPickerProps = {
    emojiToolkit: {
      // imagePathPNG: 'https://twemoji.maxcdn.com/36x36/',
    },
    onSelect (emoji) {
      console.info(emoji)
    },
    search: true,
    recentCount: 36,
  };

  return (
    <EmojiPicker {...emojiPickerProps} />
  );
}

export default App;
