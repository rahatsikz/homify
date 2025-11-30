import { useState, useEffect } from 'react';
import { Dimensions, View, Text, Pressable } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';
import { Trash2, Sun, Moon } from 'lucide-react-native';
import { cn } from '../../lib/utils';
import { cssVars } from '../../lib/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUTTON_SIZE = 48;
const DELETE_ZONE_HEIGHT = 120;
const DELETE_ZONE_Y = SCREEN_HEIGHT - DELETE_ZONE_HEIGHT;

export function DraggableThemeToggler() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isVisible, setIsVisible] = useState(true);

  const x = useSharedValue(SCREEN_WIDTH - BUTTON_SIZE);
  const y = useSharedValue(100);
  const isDragging = useSharedValue(false);

  // Track start position for tap detection
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  // Shared values to communicate with JS thread
  const isDeleting = useSharedValue(false);
  const shouldToggle = useSharedValue(false);

  // Poll for UI thread requests (workaround for runOnJS )
  useEffect(() => {
    const interval = setInterval(() => {
      if (shouldToggle.value) {
        if (isDark) {
          setColorScheme('light');
        } else {
          setColorScheme('dark');
        }
        shouldToggle.value = false;
      }
      if (isDeleting.value) {
        setIsVisible(false);
        isDeleting.value = false;
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = x.value;
      startY.value = y.value;
      isDragging.value = true;
    })
    .onUpdate((event) => {
      x.value = startX.value + event.translationX;
      y.value = startY.value + event.translationY;
    })
    .onEnd((event) => {
      isDragging.value = false;

      // Tap detection (minimal movement)
      if (Math.abs(event.translationX) < 5 && Math.abs(event.translationY) < 5) {
        shouldToggle.value = true;
        // Snap back to start if it moved slightly
        x.value = withSpring(startX.value);
        y.value = withSpring(startY.value);
        return;
      }

      // Check delete zone
      if (y.value > DELETE_ZONE_Y) {
        // Animate to center of delete zone then disappear
        x.value = withTiming(SCREEN_WIDTH / 2 - BUTTON_SIZE / 2, { duration: 200 });
        y.value = withTiming(SCREEN_HEIGHT - 60, { duration: 200 }, (finished) => {
          if (finished) {
            isDeleting.value = true;
          }
        });
      } else {
        // Snap to nearest edge
        const destX = event.absoluteX < SCREEN_WIDTH / 2 ? 0 : SCREEN_WIDTH - BUTTON_SIZE;

        // Keep within vertical bounds
        let destY = y.value;
        if (destY < 50) destY = 50;
        if (destY > SCREEN_HEIGHT - 100) destY = SCREEN_HEIGHT - 100;

        x.value = withSpring(destX);
        y.value = withSpring(destY);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: x.value },
        { translateY: y.value },
        { scale: isDragging.value ? 1.1 : 1 },
      ],
      zIndex: 9999,
    };
  });

  const deleteZoneStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      y.value,
      [SCREEN_HEIGHT - 300, SCREEN_HEIGHT - 100],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {
      opacity: isDragging.value ? opacity : 0,
      transform: [{ translateY: isDragging.value ? 0 : 100 }],
    };
  });

  if (!isVisible) return null;

  return (
    <>
      <GestureDetector gesture={pan}>
        <Animated.View style={[animatedStyle, { position: 'absolute', top: 0, left: 0 }]}>
          <Pressable
            onPress={() => {
              // shouldToggle.value = true;
              isDark ? setColorScheme('light') : setColorScheme('dark');
            }}
            className={cn(
              'w-12 h-12 rounded-full items-center justify-center shadow-lg border border-border',
              isDark ? 'bg-muted' : 'bg-card',
            )}
          >
            {isDark ? (
              <Sun size={22} color={cssVars.dark.foreground} />
            ) : (
              <Moon size={22} color={cssVars.light.foreground} />
            )}
          </Pressable>
        </Animated.View>
      </GestureDetector>

      {/* delete overlay */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 40,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9998,
          },
          deleteZoneStyle,
        ]}
        pointerEvents="none"
      >
        <View className="bg-destructive/90 w-16 h-16 rounded-full items-center justify-center shadow-md">
          <Trash2 color="white" size={28} />
        </View>
        <Text className="text-destructive font-bold mt-2 bg-background/80 px-2 py-0.5 rounded text-xs">
          Remove
        </Text>
      </Animated.View>
    </>
  );
}
