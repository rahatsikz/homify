import { Stack } from 'expo-router';
import { DraggableThemeToggler } from '../../components/ui/draggable-theme-toggler';

export const unstable_settings = {
  initialRouteName: 'index',
};

const stackOptions = {
  headerShown: false,
  gestureEnabled: true,
  contentStyle: { backgroundColor: 'transparent' },
  headerStyle: { backgroundColor: 'transparent' },
  headerShadowVisible: false,
  headerBackTitleVisible: false,
  headerBackVisible: false,
  headerTintColor: 'white',
  headerTitleStyle: { color: 'white' },
  headerRightContainerStyle: { marginRight: 10 },
  headerLeftContainerStyle: { marginLeft: 10 },
};

const singleScreenOptions = {
  gestureEnabled: stackOptions.gestureEnabled,
};

export default function AuthLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          ...stackOptions,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            ...singleScreenOptions,
          }}
        />

        <Stack.Screen
          name="verification"
          options={{
            ...singleScreenOptions,
          }}
        />
        {/* <Stack.Screen
          name="profile-update"
          options={{
            ...singleScreenOptions,
          }}
        /> */}
      </Stack>
      {/* <DraggableThemeToggler /> */}
    </>
  );
}
