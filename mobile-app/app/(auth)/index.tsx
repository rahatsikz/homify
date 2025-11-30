'use client';

import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mobileSchema } from '@/schema';
import { formatBDMobile } from '@/lib/utils';
import { router, useRouter } from 'expo-router';
import { useRequestCodeMutation } from '@/apis/auth.queries';
import { useAuthStore } from '../../hooks/auth-store';
import { LoadingWrapper } from '../../components/shared/loading-wrapper';
import { showToast } from '../../components/ui/toast';

export default function App() {
  const { owner } = useAuthStore((state) => state);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (owner?.name || owner?.mobile) {
      router.replace('/home');
    } else {
      setHydrated(true);
    }
  }, [owner]);

  return (
    <LoadingWrapper isLoading={!hydrated}>
      <View className="flex-1 bg-background">
        <MobileNumberScreen />
      </View>
    </LoadingWrapper>
  );
}

export function MobileNumberScreen() {
  const { mutate: requestOtp, isPending: isLoading } = useRequestCodeMutation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof mobileSchema>>({
    resolver: zodResolver(mobileSchema),
    mode: 'onChange',
    defaultValues: { mobile: '' },
  });

  const onFormSubmit = (data: z.infer<typeof mobileSchema>) => {
    requestOtp(
      { phone: data.mobile },
      {
        onSuccess: () => {
          router.push({
            pathname: '/(auth)/verification',
            params: { mobile: data.mobile },
          });
        },
        onError: (error) => {
          console.error('Failed to send OTP:', error);
          showToast('Failed to send OTP', 'Error');
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center">
          {/* Header Section */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-foreground mb-1 text-center">Welcome</Text>
            <Text className="text-lg text-muted-foreground text-center max-w-sm leading-snug">
              Manage your house rent effortlessly and stay in control—right from your phone.
            </Text>
          </View>

          {/* Main Form Card */}
          <Card className="mx-0 mb-6">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-xl font-semibold">Phone Verification</CardTitle>
              <CardDescription className="text-base ">
                We'll send you a verification code via SMS
              </CardDescription>
            </CardHeader>

            <CardContent className="gap-y-5">
              <Controller
                control={control}
                name="mobile"
                render={({ field: { onChange, value } }) => (
                  <View className="gap-y-2">
                    <Label nativeID="mobile" className="text-sm font-medium">
                      Mobile Number
                    </Label>
                    <View className="relative">
                      <Input
                        placeholder="01XXX-XXXXXX"
                        keyboardType="phone-pad"
                        maxLength={15}
                        value={formatBDMobile(value || '')}
                        onChangeText={(text) => onChange(text.replace(/\D/g, ''))}
                        className={`h-12 placeholder:text-sm ${
                          errors.mobile
                            ? 'border-destructive'
                            : value && isValid
                              ? 'border-green-500'
                              : ''
                        }`}
                      />
                      {value && isValid && (
                        <View className="absolute right-3.5 top-2.5">
                          <Text className="text-green-500 text-lg">✓</Text>
                        </View>
                      )}
                    </View>
                    {errors.mobile && (
                      <Text className="text-destructive text-sm mt-1">{errors.mobile.message}</Text>
                    )}
                  </View>
                )}
              />

              <Button
                onPress={handleSubmit(onFormSubmit)}
                disabled={!isValid || isLoading}
                className="w-full h-12"
              >
                <Text className="text-base text-foreground font-semibold">
                  {isLoading ? 'Sending Code...' : 'Send OTP'}
                </Text>
              </Button>
            </CardContent>
          </Card>

          {/* Security Info */}
          <View className="items-center gap-y-1">
            <View className="flex-row items-center">
              <Text className="text-sm text-muted-foreground">End-to-end encrypted</Text>
            </View>

            <Text className="text-sm text-muted-foreground text-center leading-relaxed max-w-sm">
              By continuing, you agree to our <Text className="text-primary">Terms of Service</Text>{' '}
              and <Text className="text-primary">Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
