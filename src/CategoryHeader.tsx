import React, {Component} from "react";
// @ts-ignore
import shallowCompare from "react-addons-shallow-compare";

export interface CategoryHeaderProps {
  category: {
    title: string;
  },
  headingDecoration?: any;
  style?: object;
}

export default class CategoryHeader extends Component<CategoryHeaderProps> {
  shouldComponentUpdate(nextProps: CategoryHeaderProps, nextState: any) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const {category, headingDecoration, style} = this.props;

    return (
      <div className="emoji-category-header" style={style}>
        <h2 className="emoji-category-title">
          {category.title}
        </h2>
        <div className="emoji-category-heading-decoration">
          {headingDecoration}
        </div>
      </div>
    );
  }
}
