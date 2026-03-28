import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const MessagingNotifications = () => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('farmer.messagesNotifications')}</Text>
      <View style={styles.content}>
        <Text>{t('farmer.noNewMessages')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
});

export default MessagingNotifications;
