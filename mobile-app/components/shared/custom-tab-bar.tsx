import { cn } from '@/lib/utils';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LucideIcon, Zap, User, House, Banknote } from 'lucide-react-native';
import { Pressable, Text, View, LayoutAnimation } from 'react-native';
import { NavigationRoute, ParamListBase } from '@react-navigation/native';
import { useThemeColors } from '../../lib/colors';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type TabMeta = {
  icon: LucideIcon;
  label: string;
};
type TabMap = Record<string, TabMeta>;
type TabRoute = NavigationRoute<ParamListBase, string>;

const tabConfig: TabMap = {
  index: { icon: House, label: 'Home' },
  'tenants/index': { icon: Banknote, label: 'Rent' },
  'profile/index': { icon: User, label: 'Profile' },
  'manage-power/index': { icon: Zap, label: 'Power' },
};

const TabItem = ({
  route,
  isFocused,
  onPress,
  tabMeta,
}: {
  route: TabRoute;
  isFocused: boolean;
  onPress: () => void;
  tabMeta: TabMeta;
}) => {
  const { colors, isDark } = useThemeColors();

  const onFocusColor = isDark ? colors.foreground : colors.background;

  const scale = useSharedValue(1);

  // Icon zoom effect when focused
  const iconScale = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isFocused ? 1.15 : 1, { duration: 300 }) }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { duration: 100 });
  };

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const Icon = tabMeta.icon;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="flex-1 items-center justify-center px-0"
    >
      <Animated.View
        style={[animatedContainerStyle]}
        className={cn(
          'w-full items-center justify-center rounded-full h-full pb-2 pt-2.5 px-2.5 min-w-[80px]',
          isFocused ? 'bg-primary' : 'bg-transparent',
        )}
      >
        <Animated.View style={iconScale}>
          <Icon
            size={18}
            color={isFocused ? onFocusColor : colors.mutedForeground}
            strokeWidth={isFocused ? 2.5 : 2}
          />
        </Animated.View>
        <Text
          className={cn(
            'mt-0.5 whitespace-nowrap text-center font-medium text-muted-foreground',
            isFocused ? 'text-xs font-bold' : 'text-[11px]',
          )}
          style={{ color: isFocused ? onFocusColor : colors.mutedForeground }}
        >
          {tabMeta.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const tabInfo = (route: TabRoute) => tabConfig[route.name];
  const onPress = (route: TabRoute, index: number) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (index !== state.index && !event.defaultPrevented) {
      // Animate layout changes
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      navigation.navigate(route.name);
    }
  };

  return (
    <View className="absolute bottom-5 w-full items-center px-0.5">
      <View className="flex-row items-center justify-between rounded-full bg-background border border-border px-2.5 gap-3 py-2 shadow-lg shadow-black/5 w-full">
        {state.routes.map((route, idx) => {
          const isFocused = state.index === idx;
          const meta = tabInfo(route);
          if (!meta) return null;

          return (
            <TabItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              onPress={() => onPress(route, idx)}
              tabMeta={meta}
            />
          );
        })}
      </View>
    </View>
  );
}
