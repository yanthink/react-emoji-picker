import React from 'react';
import { Form, Button, Comment, Icon, Input } from 'antd';
import Trigger from 'rc-trigger';
import YtEmojiPicker from 'yt-emoji-picker';
import emojiToolkit from 'emoji-toolkit';
import 'yt-emoji-picker/dist/style.css';
import 'rc-trigger/assets/index.css';
import './index.css';

const FormItem = Form.Item;
const { TextArea } = Input;

const builtinPlacements = {
  left: {
    points: ['cr', 'cl'],
  },
  right: {
    points: ['cl', 'cr'],
  },
  top: {
    points: ['bc', 'tc'],
  },
  bottom: {
    points: ['tc', 'bc'],
  },
  topLeft: {
    points: ['bl', 'tl'],
  },
  topRight: {
    points: ['br', 'tr'],
  },
  bottomRight: {
    points: ['tr', 'br'],
  },
  bottomLeft: {
    points: ['tl', 'bl'],
  },
};

function insertText (texteara, str) {
  if (document.selection) {
    const sel = document.selection.createRange();
    sel.text = str;
  } else if (typeof texteara.selectionStart === 'number' && typeof texteara.selectionEnd === 'number') {
    const startPos = texteara.selectionStart;
    const endPos = texteara.selectionEnd;
    let cursorPos = startPos;
    const tmpStr = texteara.value;
    texteara.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
    cursorPos += str.length;
    texteara.selectionStart = texteara.selectionEnd = cursorPos;
  } else {
    texteara.value += str;
  }

  return texteara.value;
}

@Form.create()
class Demo extends React.Component {
  setTextareaRef = (ref) => {
    this.textarea = ref;
  };

  render () {
    const { form: { getFieldDecorator, setFieldsValue, getFieldValue } } = this.props;

    const emojiPickerProps = {
      onSelect: (emoji) => {
        const text = emojiToolkit.shortnameToUnicode(emoji.shortname);
        const value = insertText(this.textarea.textAreaRef, text);
        setFieldsValue({ content: value });
      },
      search: true,
      recentCount: 36,
    };

    return (
      <div style={{ maxWidth: 900, margin: 'auto', padding: '4em 20px 0 80px' }}>
        <Comment
          content={
            <div className="editor">
              <FormItem>
                {getFieldDecorator('content')(
                  <TextArea
                    ref={this.setTextareaRef}
                    autosize={{
                      minRows: 5,
                    }}
                  />,
                )}
              </FormItem>
              <FormItem>
                <div className="actions">
                  <div>
                    <Trigger
                      action={['click']}
                      popupAlign={{
                        offset: [0, 12],
                      }}
                      popupPlacement="bottomLeft"
                      builtinPlacements={builtinPlacements}
                      popup={<YtEmojiPicker {...emojiPickerProps} />}
                    >
                      <Icon type="smile" theme="outlined" style={{ fontSize: 20 }} />
                    </Trigger>
                  </div>
                  <div>
                    <Button
                      htmlType="submit"
                      type="primary"
                      icon="message"
                    >
                      评论
                    </Button>
                  </div>
                </div>
              </FormItem>
              {
                getFieldValue('content') &&
                <FormItem>
                  <div
                    className="preview"
                    dangerouslySetInnerHTML={{
                      __html: emojiToolkit.toImage(getFieldValue('content')),
                    }}
                  />
                </FormItem>
              }
            </div>
          }
        />
      </div>
    )
  }
}

export default Demo;
