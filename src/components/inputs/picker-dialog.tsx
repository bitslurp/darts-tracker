import React, { FunctionComponent, useState } from 'react';
import {
  List,
  Portal,
  Dialog,
  Paragraph,
  Button,
  RadioButton,
  TextInput,
} from 'react-native-paper';
import { View, TouchableHighlight } from 'react-native';

interface PickerDialogProps {
  label: string;
  defaultValue: string;

  onDismiss?: () => void;
  onDone(selectedValue: string): void;
  options: { value: string; label: string }[];
}

const PickerDialog: FunctionComponent<PickerDialogProps> = ({
  onDismiss,
  onDone,
  defaultValue,
  options,
  label,
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [visible, setVisible] = useState(false);

  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={{ flex: 1 }}
          disabled={true}
          label={label}
          value={selectedValue}
        />
        <Button onPress={() => setVisible(true)}>Edit</Button>
      </View>
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => {
            onDismiss();
            setVisible(false);
          }}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Paragraph>This is simple dialog</Paragraph>
            <RadioButton.Group
              onValueChange={value => setSelectedValue(value)}
              value={selectedValue}>
              {options.map(option => (
                <List.Item
                  key={option.value}
                  title={option.label}
                  onPress={() => setSelectedValue(option.value)}
                  left={() => <RadioButton.Android value={option.value} />}
                />
              ))}
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setVisible(false);
                onDone(selectedValue);
              }}>
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default PickerDialog;
