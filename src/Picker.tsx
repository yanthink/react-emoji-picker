import React from "react";
// @ts-ignore
import emojiToolkit from "emoji-toolkit";
// @ts-ignore
import strategy from 'emoji-toolkit/emoji.json';
import {each} from 'lodash';
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
} from './uitls'
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
  headerHowHeight?: number;
  rowHeight?: number;
}

export interface PickerState {
  emojiData: EmojiDataType;
  recentUnicodes: string[];
  recentRows: [];
  modifier: number; // 肤色 0-5
  category: string;
  term: string;
}

export type CategoriesType = { [key: string]: { title: string; emoji: string; } };

const categories: { [key: string]: { title: string; emoji: string; } } = {
  recent: {
    title: '常用',
    emoji: 'clock3',
  },
  people: {
    title: '表情符号与任务',
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
    recentCount: 36,
    headerHowHeight: 34,
    rowHeight: 40,
  };

  state: PickerState = {
    emojiData: createEmojiDataFromStrategy(strategy),
    recentUnicodes: store.get('emoji-recent', []),
    recentRows: [],
    category: 'recent',
    modifier: store.get('emoji-modifier') || 0,
    term: '',
  };

  /**
   * search input ref
   */
  search: any;

  rowsSelector: any;

  recentRowsSelector: any;

  /**
   * Categories ref
   */
  categories: any;

  componentWillMount() {
    each(this.props.emojiToolkit, (value, key) => {
      // @ts-ignore
      emojiToolkit[key] = value;
    });

    this.rowsSelector = createRowsSelector();
    this.recentRowsSelector = createRecentRowsSelector();

    this.reloadRecentRows(this.state.recentUnicodes);
  }

  componentDidMount() {
    this.setState({category: this.categories.getActiveCategory()});
  }

  componentWillUnmount() {
    const {recentUnicodes} = this.state;
    store.set('emoji-recent', recentUnicodes);
  }

  onActiveCategoryChange = (category: string) => {
    if (category !== this.state.category) {
      this.setState({category});
      if (category === 'recent') {
        this.reloadRecentRows(this.state.recentUnicodes);
      }
    }
  };

  onModifierChange = (modifier: number) => {
    this.setState({modifier});
    store.set('emoji-modifier', modifier);
  };

  setCategoriesRef = (categories: any) => {
    this.categories = categories;
  };

  setSearchRef = (ref: any) => {
    this.search = ref;
  };

  handleSearch = () => {
    this.setState({term: this.search.value});
  };

  handleEmojiSelect = (emoji: any) => {
    let {recentUnicodes} = this.state;
    const originalRecentUnicodesCount = recentUnicodes.length;

    recentUnicodes = recentUnicodes.filter(unicode => unicode !== emoji.code_points.output);
    recentUnicodes.unshift(emoji.code_points.output);
    if (recentUnicodes.length > this.props.recentCount) {
      recentUnicodes = recentUnicodes.slice(0, this.props.recentCount);
    }
    this.setState({recentUnicodes});
    store.set('emoji-recent', recentUnicodes);

    if (emoji.category !== 'recent' && originalRecentUnicodesCount < this.props.recentCount) {
      this.reloadRecentRows(recentUnicodes);
    }

    this.props.onSelect(emoji);
  };

  reloadRecentRows(recentUnicodes: string[]) {
    const {recentCount} = this.props;

    let recentRows = [];
    if (categories.recent && recentCount > 0) {
      recentRows = this.recentRowsSelector({recent: categories.recent}, getRecentCategory(strategy, recentUnicodes.slice(0, recentCount)));
    }

    this.setState({recentRows});
  }

  renderHeader() {
    const {rowHeight, recentCount} = this.props;
    return (
      <header className="emoji-dialog-header" role="menu">
        <ul style={{height: rowHeight}}>
          {Object.keys(categories).map(key => {
            if (recentCount < 1 && key === 'recent') {
              return null;
            }
            const category = categories[key];
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
                  emoji={{shortname: `:${category.emoji}:`}}
                  ariaLabel={category.title}
                  role="menuitem"
                  onSelect={() => {
                    this.categories.jumpToCategory(key);
                  }}
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
    const {headerHowHeight, rowHeight, search} = this.props;
    const {emojiData, modifier, term, recentRows} = this.state;
    let rows: any = this.rowsSelector(categories, emojiData, modifier, term);

    if (!term && categories.recent && recentRows.length > 0) {
      rows = recentRows.concat(rows);
    }

    return (
      <div
        className="emoji-categories-wrapper"
        style={{top: search ? rowHeight as number + 38 : rowHeight}}
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
        />
      </div>
    );
  }

  render() {
    const {headerHowHeight, rowHeight} = this.props;
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
