import React, { FunctionComponent, ReactNode } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import {
  Appbar,
  ProgressBar,
  Colors,
  FAB,
  DarkTheme,
} from 'react-native-paper';

interface BackTemplateProps {
  title: string;
  subtitle?: string;
  backButton?: boolean;
  drawerMenuButton?: boolean;
  navigation: NavigationProp<any>;
  onCreate?: () => void;
  onBack?: () => void;
  createButtonIcon?: string;
  loading?: boolean;
  displayContent?: boolean;
  secondaryTopNav?: ReactNode;
  actions?: { icon: string; onPress(): void }[];
}

export const GeneralScreenTemplate: FunctionComponent<BackTemplateProps> = ({
  actions = [],
  children,
  navigation,
  title,
  subtitle,
  onCreate,
  loading = false,
  secondaryTopNav = null,
  createButtonIcon = 'plus',
  drawerMenuButton = false,
  displayContent = true,
  backButton = false,
  onBack,
}) => (
  <SafeAreaView style={styles.container}>
    <Appbar>
      {backButton ? (
        <Appbar.Action
          icon="chevron-left"
          onPress={() => {
            onBack && onBack();
            navigation.goBack();
          }}
        />
      ) : null}
      <Appbar.Content title={title} subtitle={subtitle} />
      {actions.map(action => (
        <Appbar.Action
          key={action.icon}
          icon={action.icon}
          onPress={action.onPress}
        />
      ))}
      {drawerMenuButton ? (
        <Appbar.Action icon="menu" onPress={() => {}} />
      ) : null}
    </Appbar>
    {secondaryTopNav}
    <ProgressBar indeterminate={true} visible={loading} color={Colors.red800} />
    <View style={styles.screenContent}>{displayContent ? children : null}</View>
    {onCreate && (
      <FAB
        onPress={onCreate}
        icon={createButtonIcon}
        style={{ position: 'absolute', bottom: 35, right: 35 }}
      />
    )}
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.colors.background,
  },
  screenContent: {
    marginHorizontal: '2%',
    flex: 1,
  },
});
