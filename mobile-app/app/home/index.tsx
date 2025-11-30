import { Text, View } from 'react-native';
import { useAuthStore } from '../../hooks/auth-store';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const { owner } = useAuthStore((state) => state);
  return (
    <View className="flex-1 bg-background">
      <Text className="text-foreground text-2xl font-bold">
        Welcome {owner?.name} {owner?.mobile}
      </Text>
    </View>
  );
}
