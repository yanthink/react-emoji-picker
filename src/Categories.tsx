import React, {Component} from "react";
import PropTypes from "prop-types";
// @ts-ignore
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
// @ts-ignore
import List from "react-virtualized/dist/commonjs/List";
import {findIndex, throttle} from "lodash";
import CategoryHeader from "./CategoryHeader";
import EmojiRow from "./EmojiRow";
import Modifiers from "./Modifiers";
import {EmojiType} from "./uitls";

export interface CategoriesProps {
  rows: { category: object; id: string }[];
  headerHowHeight: number;
  rowHeight: number;
  modifier: number;
  onActiveCategoryChange: (category: string) => void;
  onSelect: (emoji: EmojiType) => void;
  onModifierChange: (modifier: number) => void;
}

export default class Categories extends Component<CategoriesProps> {
  lastActiveCategory?: string;
  /**
   * 所有 CategoryHeader ref 对象
   */
  categories: any = {};
  /**
   * List ref
   */
  list: any;

  componentDidUpdate(prevProps: CategoriesProps) {
    if (
      this.props.rows !== prevProps.rows ||
      this.props.modifier !== prevProps.modifier
    ) {
      this.list.recomputeRowHeights();
    }
  }

  setListRef = (list: any) => {
    this.list = list;
  };

  onScroll = throttle(
    ({scrollTop}) => {
      const activeCategory = this.getActiveCategory(scrollTop);
      if (activeCategory !== this.lastActiveCategory) {
        this.lastActiveCategory = activeCategory;
        this.props.onActiveCategoryChange(activeCategory);
      }
    },
    100
  );

  getActiveCategory = (scrollTop = 0) => {
    const {rows} = this.props;

    if (scrollTop === 0) {
      if (rows.length === 0) return undefined;
      return rows[0].id;
    }

    let firstFullyVisibleRowIndex = 0;
    let accumulatedScrollTop = 0;

    while (accumulatedScrollTop < scrollTop) {
      accumulatedScrollTop += this.rowHeight({
        index: firstFullyVisibleRowIndex
      });

      if (accumulatedScrollTop <= scrollTop) {
        firstFullyVisibleRowIndex += 1;
      }
    }

    const currentRow = this.props.rows[firstFullyVisibleRowIndex];

    if (Array.isArray(currentRow)) {
      return currentRow[0].category;
    }

    return currentRow.id;
  };

  rowHeight = ({index}: { index: number }) => {
    const {rows, headerHowHeight, rowHeight} = this.props;
    const row = rows[index];
    return Array.isArray(row) ? rowHeight : headerHowHeight;
  };

  rowRenderer = ({key, index, style}: { key: string; index: number; style: object }) => {
    const row = this.props.rows[index];
    const {onSelect} = this.props;

    if (Array.isArray(row)) { // 渲染emoji表情
      return (
        <EmojiRow key={key} onSelect={onSelect} style={style} emojis={row} />
      );
    }

    const {category, id} = row;
    const attributes: any = {
      key,
      category,
      ref: this.setCategoryRef(id),
      style,
    };

    if (index === 0) { // 渲染肤色选择按钮
      const {modifier, onModifierChange} = this.props;

      attributes.headingDecoration = (
        <Modifiers active={modifier} onChange={onModifierChange} />
      );
    }

    return <CategoryHeader {...attributes} />;
  };

  setCategoryRef = (id: string) => {
    return (category: any) => {
      this.categories[id] = category;
    };
  };

  jumpToCategory = (id: string) => {
    const index = Math.max(findIndex(this.props.rows, category => category.id === id), 0);
    this.list.scrollToRow(index);
  };

  render() {
    const rowCount = this.props.rows.length;

    return (
      <AutoSizer>
        {
          ({height, width}: { height: number; width: number }) => (
            <List
              height={height}
              onScroll={this.onScroll}
              ref={this.setListRef}
              rowCount={rowCount}
              rowHeight={this.rowHeight}
              rowRenderer={this.rowRenderer}
              scrollToAlignment="start"
              tabIndex={null}
              width={width}
            />
          )
        }
      </AutoSizer>
    );
  }
}
