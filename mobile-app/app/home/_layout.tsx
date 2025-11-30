import { Tabs } from 'expo-router';
import { DraggableThemeToggler } from '@/components/ui/draggable-theme-toggler';
import CustomTabBar from '../../components/shared/custom-tab-bar';

export default function HomeTabLayout() {
  return (
    <>
      <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="tenants/index" />
        <Tabs.Screen name="manage-power/index" />
        <Tabs.Screen name="profile/index" />
      </Tabs>
    </>
  );
}
