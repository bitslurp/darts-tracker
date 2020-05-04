import React, { FunctionComponent, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, DarkTheme } from 'react-native-paper';
import ThrowPosition, {
  BoardNumberMultiplier,
  BoardPosition,
} from '../../data/Throw';
import { range } from 'ramda';

const DartsScoreButton: FunctionComponent<{
  label: string;
  value: any;
  last?: boolean;
  highlight?: boolean;
  onPress: (val: any) => void;
}> = ({ onPress, label, last = false, value, highlight }) => (
  <View style={last ? style.lastButtonContainer : style.buttonContainer}>
    <View style={highlight ? style.buttonHighlight : null}>
      <Button
        color={highlight ? DarkTheme.colors.accent : DarkTheme.colors.primary}
        style={highlight ? style.keypadButtonHighlighted : style.keypadButton}
        onPress={() => onPress(value)}>
        {label}
      </Button>
    </View>
  </View>
);

// 20 to 1 over four rows
const numberRowRanges = range(0, 4)
  .map(val => {
    const start = val * 5;
    return range(start + 1, start + 6).reverse();
  })
  .reverse();
const borderColor = '#777';
const DartsScoreKeypad: FunctionComponent<{
  onSelect: (bp: BoardPosition) => void;
}> = ({ onSelect }) => {
  const [multiplier, setMultiplier] = useState(BoardNumberMultiplier.Single);
  return (
    <View style={style.keypadContainer}>
      <View style={style.keypadRowContainer}>
        <DartsScoreButton
          label="Single"
          highlight={multiplier === BoardNumberMultiplier.Single}
          value={BoardNumberMultiplier.Single}
          onPress={setMultiplier}
        />
        <DartsScoreButton
          label="Double"
          highlight={multiplier === BoardNumberMultiplier.Double}
          value={BoardNumberMultiplier.Double}
          onPress={setMultiplier}
        />
        <DartsScoreButton
          label="Treble"
          highlight={multiplier === BoardNumberMultiplier.Treble}
          value={BoardNumberMultiplier.Treble}
          onPress={setMultiplier}
          last={true}
        />
      </View>
      {numberRowRanges.map((range, rowIndex) => (
        <View key={rowIndex} style={style.keypadRowContainer}>
          {range.map((val, buttonIndex) => (
            <DartsScoreButton
              key={val}
              label={val.toString()}
              value={val}
              last={buttonIndex === 4}
              onPress={val => onSelect(ThrowPosition.of(val, multiplier))}
            />
          ))}
        </View>
      ))}
      <View
        style={{
          ...style.keypadRowContainer,
          borderTopWidth: 3,
          borderTopColor: borderColor,
        }}>
        <DartsScoreButton
          label="Bull"
          value={ThrowPosition.innerBull}
          onPress={onSelect}
        />

        <DartsScoreButton
          label="Outer Bull"
          value={ThrowPosition.outerBull}
          onPress={onSelect}
        />
        <DartsScoreButton
          label="Missed"
          value={ThrowPosition.miss}
          onPress={onSelect}
          last={true}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  keypadButton: {
    // flex: 1,
  },
  buttonContainer: {
    flex: 1,
    borderColor,
    borderRightWidth: 1,
    borderTopWidth: 1,
  },
  lastButtonContainer: {
    flex: 1,
    borderColor,
    borderTopWidth: 1,
  },
  keypadContainer: {
    borderColor,
    borderBottomWidth: 1,
  },
  keypadRowContainer: {
    flexDirection: 'row',
  },
  buttonHighlight: {
    // backgroundColor: DarkTheme.colors.primary,
  },
  keypadButtonHighlighted: {
    color: 'green',
  },
});

export default DartsScoreKeypad;
