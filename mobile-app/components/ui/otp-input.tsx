import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, Text, Animated, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

type Props = {
  value: string;
  onChange: (code: string) => void;
  length?: number;
  onComplete?: (code: string) => void;
  autoFocus?: boolean;
};

export function OtpInput({ value, onChange, length = 6, onComplete, autoFocus = true }: Props) {
  const [isFocused, setFocused] = useState(false);
  const hiddenInputRef = useRef<TextInput>(null);
  const [cursorIndex, setCursorIndex] = useState(0);

  // Keep previous length to detect backspace
  const prevLength = useRef(value.length);

  useEffect(() => {
    setCursorIndex(value.length);
  }, [value]);

  const handleChange = (text: string) => {
    // Only allow 0-9 and a-f
    const clean = text
      .replace(/[^0-9a-f]/gi, '')
      .slice(0, length)
      .toLowerCase();

    // Detect backspace
    if (clean.length < prevLength.current) {
      // console.log('Backspace detected');
    }

    prevLength.current = clean.length;
    onChange(clean);
    setCursorIndex(clean.length);

    if (clean.length === length) onComplete?.(clean);
  };

  const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

  return (
    <Pressable
      onPress={() => {
        setFocused(true); // immediately set focused
        setTimeout(() => hiddenInputRef.current?.focus(), 0); // ensure native focus
        setCursorIndex(value.length); // sync cursor
      }}
    >
      <View className="flex-row justify-start w-full">
        {/* Hidden real input */}
        <TextInput
          ref={hiddenInputRef}
          value={value}
          onChangeText={handleChange}
          keyboardType="default"
          textContentType="oneTimeCode"
          maxLength={length}
          autoFocus={autoFocus}
          style={{
            position: 'absolute',
            opacity: 0.01, // very low but > 0 for Android to detect key events
            height: 1,
            width: 1,
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {/* Fake boxes */}
        {digits.map((d, i) => {
          const active = isFocused && i === cursorIndex;
          return (
            <View
              key={i}
              className={cn(
                'h-12 w-12 justify-center border-border items-center border-2 rounded-md mx-[6.3px] bg-card',
                active && 'border-primary',
              )}
            >
              {d ? (
                <Text className="text-xl font-semibold text-foreground">{d}</Text>
              ) : active ? (
                <BlinkingCursor color={'#0094d9'} />
              ) : null}
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}

// Blinking cursor component
export function BlinkingCursor({ color }: { color: string }) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
    );
    blink.start();
    return () => {
      blink.stop();
      opacity.setValue(1);
    };
  }, [opacity]);

  return (
    <Animated.View
      style={{ width: 2, height: 24, backgroundColor: color, opacity, borderRadius: 1 }}
    />
  );
}
