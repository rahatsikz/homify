import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TenantScreen() {
  return (
    <View className="flex-1 bg-background">
      <Text className="text-foreground text-2xl font-bold">Tenants Hub</Text>
    </View>
  );
}
