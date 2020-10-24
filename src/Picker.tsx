import React from 'react';
// @ts-ignore
import strategy from 'emoji-toolkit/emoji.json';
import { difference } from 'lodash';
import store from 'store';
import Emoji from './Emoji';
import Categories from './Categories';
import {
  createEmojiDataFromStrategy,
  getRecentCategory,
  EmojiDataType,
  EmojiType,
  createRowsSelector,
  createRecentRowsSelector
} from './utils';
import './style.less';

export interface PickerProps {
  /**
   * 配置文档 https://github.com/joypixels/emoji-toolkit/blob/master/USAGE.md
   */
  emojiToolkit?: {
    emojiSize?: number;
    imagePathPNG?: string;
    sprites?: boolean;
    spriteSize?: number;
  },
  search: boolean;
  onSelect: (emoji: EmojiType) => void;
  recentCount: number;
  categories?: CategoriesType;
  headerHowHeight?: number;
  rowHeight?: number;
}

export interface PickerState {
  emojiData: EmojiDataType;
  recentKeys: string[];
  recentRows: [];
  modifier: number; // 肤色 0-5
  category: string;
  term: string;
}

export type CategoriesType = { [key: string]: { title: string; emoji: string; } };

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

export default class Picker extends React.Component<PickerProps, PickerState> {
  static defaultProps = {
    categories: defaultCategories,
    recentCount: 36,
    headerHowHeight: 34,
    rowHeight: 40,
  };

  state: PickerState = {
    emojiData: createEmojiDataFromStrategy(strategy),
    recentKeys: store.get('emoji-recent', []),
    recentRows: [],
    category: 'recent',
    modifier: store.get('emoji-modifier') || 0,
    term: '',
  };

  /**
   * search input ref
   */
  searchRef: any;

  rowsSelector: any;

  recentRowsSelector: any;

  /**
   * Categories ref
   */
  categoriesRef: any;

  constructor(props: PickerProps) {
    super(props);

    if (!Array.isArray(this.state.recentKeys)) {
      this.state.recentKeys = [];
      store.remove('emoji-recent');
    }
  }

  componentWillMount() {
    this.rowsSelector = createRowsSelector();
    this.recentRowsSelector = createRecentRowsSelector();

    this.reloadRecentRows(this.state.recentKeys);
  }

  componentDidMount() {
    this.setState({ category: this.categoriesRef.getActiveCategory() });
  }

  componentWillUnmount() {
    const { recentKeys } = this.state;
    store.set('emoji-recent', recentKeys);
  }

  onActiveCategoryChange = (category: string) => {
    if (category !== this.state.category) {
      this.setState({ category });
      if (category === 'recent') {
        this.reloadRecentRows(this.state.recentKeys);
      }
    }
  };

  onModifierChange = (modifier: number) => {
    this.setState({ modifier });
    store.set('emoji-modifier', modifier);
  };

  setCategoriesRef = (ref: any) => {
    this.categoriesRef = ref;
  };

  setSearchRef = (ref: any) => {
    this.searchRef = ref;
  };

  handleSearch = () => {
    this.setState({ term: this.searchRef.value });
  };

  handleEmojiSelect = (emoji: any) => {
    let { recentKeys } = this.state;
    const originalRecentKeysCount = recentKeys.length;

    recentKeys = recentKeys.filter(key => key !== emoji._key);
    recentKeys.unshift(emoji._key);
    if (recentKeys.length > this.props.recentCount) {
      recentKeys = recentKeys.slice(0, this.props.recentCount);
    }
    this.setState({ recentKeys });
    store.set('emoji-recent', recentKeys);

    if (emoji.category !== 'recent' && originalRecentKeysCount < this.props.recentCount) {
      this.reloadRecentRows(recentKeys);
    }

    this.props.onSelect(emoji);
  };

  reloadRecentRows(recentKeys: string[]) {
    const { recentCount, categories } = this.props;

    let recentRows = [];
    if (categories!.recent && recentCount > 0) {
      let keys = recentKeys.slice(0, recentCount);

      const { recentCategory, notFounds } = getRecentCategory(strategy, keys);

      if (notFounds.length > 0) {
        keys = difference(keys, notFounds);
        this.setState({ recentKeys: keys });
        store.set('emoji-recent', keys);
      }

      recentRows = this.recentRowsSelector({ recent: categories!.recent }, recentCategory);
    }

    this.setState({ recentRows });
  }

  renderHeader() {
    const { rowHeight, recentCount, categories } = this.props;
    return (
      <header className="emoji-dialog-header" role="menu">
        <ul style={{ height: rowHeight }}>
          {Object.keys(categories!).map((key: string) => {
            if (recentCount < 1 && key === 'recent') {
              return null;
            }
            const category = categories![key];
            return (
              <li
                key={key}
                className={this.state.category === key ? "active" : undefined}
                style={{
                  width: rowHeight,
                  height: rowHeight,
                }}
              >
                <Emoji
                  emoji={{ shortname: `:${category.emoji}:` }}
                  ariaLabel={category.title}
                  role="menuitem"
                  onSelect={() => {
                    this.categoriesRef.jumpToCategory(key);
                  }}
                  emojiToolkit={this.props.emojiToolkit}
                />
              </li>
            )
          })}
        </ul>
      </header>
    )
  }

  renderSearch() {
    if (this.props.search) {
      return (
        <div className="emoji-search-wrapper">
          <input
            className="emoji-search"
            type="search"
            ref={this.setSearchRef}
            onChange={this.handleSearch}
          />
        </div>
      );
    }
  }

  renderContent() {
    const { headerHowHeight, rowHeight, search, categories } = this.props;
    const { emojiData, modifier, term, recentRows } = this.state;
    let rows: any = this.rowsSelector(categories, emojiData, modifier, term);

    if (!term && categories!.recent && recentRows.length > 0) {
      rows = recentRows.concat(rows);
    }

    return (
      <div
        className="emoji-categories-wrapper"
        style={{ top: search ? rowHeight as number + 38 : rowHeight }}
      >
        <Categories
          ref={this.setCategoriesRef}
          rows={rows}
          headerHowHeight={headerHowHeight as number}
          rowHeight={rowHeight as number}
          modifier={modifier}
          onSelect={this.handleEmojiSelect}
          onActiveCategoryChange={this.onActiveCategoryChange}
          onModifierChange={this.onModifierChange}
          emojiToolkit={this.props.emojiToolkit}
        />
      </div>
    );
  }

  render() {
    const { headerHowHeight, rowHeight } = this.props;
    const dialogWidth = rowHeight as number * 9 + 30;
    const dialogHeight = rowHeight as number * 7 + (headerHowHeight as number);
    return (
      <div
        className="emoji-dialog"
        role="dialog"
        style={{
          width: dialogWidth,
          height: dialogHeight,
        }}
      >
        {this.renderHeader()}
        {this.renderSearch()}
        {this.renderContent()}
      </div>
    );
  }
}
