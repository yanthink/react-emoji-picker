## React Emoji Picker

基于 [emoji-toolkit](https://github.com/joypixels/emoji-toolkit) 实现的 emoji picker

* 演示地址: https://www.einsition.com/demos/yt-emoji-picker
* Emoji cheat sheet 速查表: https://www.einsition.com/tools/emoji-cheat-sheet

### 安装

```
npm install -S yt-emoji-picker
```


### 使用

您可以在 [demo](demo/src/pages/index.js) 中查看基本用法。

### Demo

```
git clone https://github.com/yanthink/react-emoji-picker
cd react-emoji-picker
npm install
npm run build
npm link

cd demo
npm install
npm link yt-emoji-picker
npm start
```

### API

| 参数 | 说明 | 类型 | 默认值	 |
| --- | --- | --- | --- |
| emojiToolkit | [emoji-toolkit配置](https://github.com/joypixels/emoji-toolkit/blob/master/USAGE.md) | object |  - |
| categories | 类别设置 | { [key: string]: { title: string; emoji: string; } } | [defaultCategories](#defaultCategories) |
| search | 启用搜索选项 | boolean | false |
| onSelect | 选择emoji表情时触发 | emoji => void | 无 |
| recentCount | 常用表情个数，小于1时不显示常用表情 | number | 36 |
| headerHowHeight | 类型标题高度 | number | 34 |
| rowHeight | emoji行高 | number | 40 |


### defaultCategories
```json
const defaultCategories: CategoriesType = {
  recent: {
    title: '常用',
    emoji: 'clock3',
  },
  people: {
    title: '表情符号与人物',
    emoji: 'smile',
  },
  nature: {
    title: '动物与自然',
    emoji: 'hamster',
  },
  food: {
    title: '食物与饮料',
    emoji: 'pizza',
  },
  activity: {
    title: '活动',
    emoji: 'soccer',
  },
  travel: {
    title: '旅行与地点',
    emoji: 'earth_americas',
  },
  objects: {
    title: '物体',
    emoji: 'bulb',
  },
  symbols: {
    title: '符号',
    emoji: 'symbols',
  },
  flags: {
    title: '旗帜',
    emoji: 'flag_cn',
  },
};
```
