import React from 'react';
import  classnames from 'classnames';
import styles from './style.less';

export interface ModifiersProps {
  active: number;
  onChange: (modifier: number) => void;
}

const modifiers: string[] = [
  '#FFDE5C',
  '#FFE1BB',
  '#FFD0A9',
  '#D7A579',
  '#B57D52',
  '#8B6858',
];

const Modifiers: React.FC<ModifiersProps> = ({ active, onChange }) => {
  return (
    <ol className={styles.modifiers}>
      {modifiers.map((hex, modifier) => (
        <li key={modifier}>
          <a
            onClick={() => onChange?.(modifier)}
            className={classnames(styles.modifiersItem, {
              [styles.modifiersItemActive]: active === modifier,
            })}
            style={{ background: hex }}
          />
        </li>
      ))}
    </ol>
  );
};

export default Modifiers;
