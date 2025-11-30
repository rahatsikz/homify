import { Alert, Platform, ToastAndroid } from 'react-native';

export const showToast = (message: string, title?: string) => {
  if (Platform.OS === 'android') ToastAndroid.show(message, ToastAndroid.SHORT);
  else Alert.alert(title || 'Info', message);
};
