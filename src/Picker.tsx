import React, { useRef, useState } from 'react';
import classnames from 'classnames';
import store from 'store';
import type { EmojiItemProps } from './EmojiItem';
import EmojiItem from './EmojiItem';
import type { EmojiBodyInstance, EmojiBodyProps } from './EmojiBody';
import EmojiBody from './EmojiBody';
import styles from './style.less';

export interface PickerProps {
  categories?: Categories;
  emojiToolkit?: EmojiItemProps['emojiToolkit'];
  recentCount?: EmojiBodyProps['recentCount'];
  size?: EmojiBodyProps['size'];
  showColCount?: number;
  showRowCount?: number;
  search?: boolean;
  onSelect?: EmojiItemProps['onSelect'];
}

export type Category = ('recent' | 'people' | 'nature' | 'food' | 'activity' | 'travel' | 'objects' | 'symbols' | 'flags');
export type Categories = { category: Category; title: string; shortname: string; }[]

const defaultCategories: Categories = [
  {
    category: 'recent',
    title: '常用',
    shortname: ':clock3:',
  },
  {
    category: 'people',
    title: '表情符号与人物',
    shortname: ':smile:',
  },
  {
    category: 'nature',
    title: '动物与自然',
    shortname: ':hamster:',
  },
  {
    category: 'food',
    title: '食物与饮料',
    shortname: ':pizza:',
  },
  {
    category: 'activity',
    title: '活动',
    shortname: ':soccer:',
  },
  {
    category: 'travel',
    title: '旅行与地点',
    shortname: ':earth_americas:',
  },
  {
    category: 'objects',
    title: '物体',
    shortname: ':bulb:',
  },
  {
    category: 'symbols',
    title: '符号',
    shortname: ':symbols:',
  },
  {
    category: 'flags',
    title: '旗帜',
    shortname: ':flag_cn:',
  },
];

const Picker: React.FC<PickerProps> = props => {
  const emojiContentRef = useRef<EmojiBodyInstance>();

  const {
    emojiToolkit,
    categories = defaultCategories,
    recentCount = 36,
    size = 40,
    showColCount = 9,
    showRowCount = 6,
  } = props;

  const [activeCategory, setActiveCategory] = useState<Category>(categories[0].category);
  const [modifier, setModifier] = useState(store.get('emoji-modifier', 0));
  const [term, setTerm] = useState('');

  const renderHeader = () => {
    return (
      <header className={styles.header}>
        <ul className={styles.headerMenu} style={{ height: size }}>
          {categories.map(({ category, title, shortname }) => (
            recentCount < 1 && category === 'recent' ? null : (
              <li
                key={category}
                className={classnames(styles.headerMenuItem, {
                  [styles.headerMenuItemActive]: activeCategory === category,
                })}
                title={title}
              >
                <EmojiItem
                  emojiToolkit={{ ...emojiToolkit, imageTitleTag: false }}
                  emoji={{ shortname }}
                  size={size}
                  onSelect={() => {
                    emojiContentRef.current?.jumpToCategory(category);
                  }}
                />
              </li>
            )
          ))}
        </ul>
      </header>
    );
  };

  const renderSearch = () => {
    if (props.search) {
      return (
        <div className={styles.search}>
          <input
            className={styles.searchInput}
            onChange={e => setTerm(e.target.value)}
          />
        </div>
      );
    }
  };

  const onModifierChange = (modifier: number) => {
    setModifier(modifier);
    store.set('emoji-modifier', modifier);
  };

  return (
    <div
      className={styles.dialog}
      style={{
        width: size * showColCount + 33,
        height: size * showRowCount + size + (props.search ? 46 : 0),
      }}
    >
      {renderHeader()}
      {renderSearch()}
      <EmojiBody
        // @ts-ignore
        ref={emojiContentRef}
        emojiToolkit={emojiToolkit}
        categories={categories}
        modifier={modifier}
        term={term}
        recentCount={recentCount}
        size={size}
        chunkSize={showColCount}
        search={props.search}
        onSelect={props.onSelect}
        onModifierChange={onModifierChange}
        onActiveCategoryChange={setActiveCategory}
      />
    </div>
  );
};

export default Picker;
