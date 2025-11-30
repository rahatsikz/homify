import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../components/ui/button';
import { cssVars } from '../../../lib/colors';
import { useAuthStore } from '../../../hooks/auth-store';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { clearAuth } = useAuthStore((state) => state);
  const handleLogout = async () => {
    try {
      await clearAuth();
      router.replace('/(auth)');
    } catch (err) {
      console.error('Failed to logout:', err);
      router.replace('/(auth)');
    }
  };
  return (
    <View className="flex-1 bg-background">
      <Text className="text-foreground mb-5 text-2xl font-bold">Profile Options</Text>
      <Button variant="destructive" onPress={handleLogout}>
        <Text style={{ color: cssVars.dark.foreground, fontWeight: '600' }}>Log Out</Text>
      </Button>
    </View>
  );
}
