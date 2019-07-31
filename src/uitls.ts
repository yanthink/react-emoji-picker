// @ts-ignore
import escape from "escape-string-regexp";
import {map, values, chunk} from 'lodash';
import {CategoriesType} from "./Picker";

export interface EmojiType {
  ascii: string[];
  category: string;
  code_points: {
    base: string;
    decimal: string;
    default_matches: string[];
    fully_qualified: string;
    greedy_matches: string[];
    non_fully_qualified: string;
    output: string;
  };
  display: number;
  diversities: any[];
  diversity: string;
  gender: string;
  genders: string[];
  keywords: string[];
  name: string;
  order: number;
  shortname: string;
  shortname_alternates: string[];
  unicode_version: number;
}

export interface EmojiDataType {
  [category: string]: {
    [shortname: string]: EmojiType[]
  }
}

export function createEmojiDataFromStrategy(strategy: { [unnicode: string]: EmojiType }) {
  const emojiData: EmojiDataType = {};

  Object.keys(strategy)
    .sort((a, b) => {
      if (strategy[a].order < strategy[b].order) {
        return -1;
      }
      if (strategy[a].order === strategy[b].order) {
        return 0;
      }
      return 1;
    })
    .forEach(key => {
      const emoji = strategy[key];
      const {shortname} = emoji;
      const keyword = shortname.replace(/:/g, '');

      if (emoji.category === 'modifier') {
        return;
      }

      // https://github.com/joypixels/emojione/issues/617
      const notFoundIcons = [
        ':digit_zero:',
        ':digit_one:',
        ':digit_two:',
        ':digit_three:',
        ':digit_four:',
        ':digit_five:',
        ':digit_six:',
        ':digit_seven:',
        ':digit_eight:',
        ':digit_nine:',
      ];

      if (notFoundIcons.includes(shortname)) {
        return;
      }

      if (!emojiData[emoji.category]) {
        emojiData[emoji.category] = {};
      }

      emoji.keywords.push(emoji.name);
      if (!emoji.keywords.includes(keyword)) {
        emoji.keywords.push(keyword);
      }

      // 肤色处理
      const match = keyword.match(/(.*?)_tone(\d?)$/);
      if (match) {
        if (!!emojiData[emoji.category][match[1]]) {
          emojiData[emoji.category][match[1]].push(emoji);
        }
      } else {
        emojiData[emoji.category][keyword] = [emoji];
      }
    });

  return emojiData;
}

/**
 * 查找对应肤色的emoji
 */
export function findEmojiVariant(emojis: EmojiType[], modifier: number) {
  return modifier && emojis[modifier] ? emojis[modifier] : emojis[0];
}

export function rowsSelector(categories: CategoriesType, emojiData: EmojiDataType, modifier: number, term: string) {
  return map(categories, (category, id) => {
    const list = emojiData[id] || {};
    let emojis = values(list).map((data) => findEmojiVariant(data, modifier));

    if (term) {
      emojis = emojis.filter(emoji => {
        const searchTermRegExp = new RegExp(`^(?:.* +)*${escape(term)}`, "i");
        return emoji.keywords.some(keyword => searchTermRegExp.test(keyword));
      });
    }

    return {category, emojis, id};
  })
    .filter(({emojis}) => emojis.length > 0)
    .map(({category, emojis, id}) => [
      {category, id},
      ...chunk(emojis, 9),
    ])
    .reduce((rows, categoryAndEmojiRows) => [...rows, ...categoryAndEmojiRows], []);
}

export function createRowsSelector() {
  let lastResult: any = null;
  let lastCategories: any = null;
  let lastModifier: any = null;
  let lastTerm: any = null;

  return function memoizedRowsSelector(categories: CategoriesType, emojiData: EmojiDataType, modifier: number, term: string) {
    if (
      lastCategories !== categories ||
      lastModifier !== modifier ||
      lastTerm !== term
    ) {
      lastResult = rowsSelector(categories, emojiData, modifier, term);
      lastCategories = categories;
      lastModifier = modifier;
      lastTerm = term;
    }

    return lastResult;
  };
}

export function createRecentRowsSelector() {
  let lastResult: any = null;
  let lastCategories: any = null;

  return function memoizedRowsSelector(categories: CategoriesType, emojiData: EmojiDataType, loadCached = false) {
    if (loadCached && lastResult.length > 0) {
      return lastResult;
    }

    if (
      lastCategories !== categories
    ) {
      lastResult = rowsSelector(categories, emojiData, 0, '');
      lastCategories = categories;
    }

    return lastResult;
  };
}

export function getRecentCategory(strategy: { [unnicode: string]: EmojiType }, recentUnicodes: string[]) {
  const recentCategory: EmojiDataType = {};

  recentUnicodes.forEach(unicode => {
    const emoji = strategy[unicode];
    const {shortname} = emoji;
    const keyword = shortname.replace(/:/g, '');
    const category = 'recent';

    if (!recentCategory[category]) {
      recentCategory[category] = {};
    }

    recentCategory[category][keyword] = [{...emoji, category: 'recent'}];
  });

  return recentCategory;
}