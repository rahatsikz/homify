'use client';

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatBDMobile } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react-native';
import { OtpInput } from '@/components/ui/otp-input';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { AUTH_QUERY_KEY, useRequestCodeMutation, useVerifyCodeMutation } from '@/apis/auth.queries';
import { useAuthStore } from '@/hooks/auth-store';
import { useQueryClient } from '@tanstack/react-query';
import { showToast } from '../../components/ui/toast';

export default function OtpVerificationScreen() {
  const { mutateAsync: verifyOtp, isPending: isVerifying } = useVerifyCodeMutation();
  const { mutateAsync: resendOtp, isPending: isResending } = useRequestCodeMutation();
  const setTokens = useAuthStore((state) => state.setTokens);
  const setOwner = useAuthStore((state) => state.setOwner);

  const isLoading = isVerifying || isResending;
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const router = useRouter();
  const { mobile } = useLocalSearchParams();
  const mobileNumber = typeof mobile === 'string' ? mobile : '';

  const { control, handleSubmit, watch, setValue } = useForm<{ otp: string }>({
    defaultValues: { otp: '' },
    mode: 'onChange',
  });

  const otp = watch('otp');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const queryClient = useQueryClient();

  const onSubmit = async (data: { otp: string }) => {
    const otpString = data.otp;
    if (otpString.length !== 6) return;

    try {
      const response = await verifyOtp({ phone: mobileNumber, code: otpString });

      if (response.success && response.data) {
        const { accessToken, refreshToken, accessTokenExp, refreshTokenExp, user } = response.data;

        await setTokens({
          accessToken,
          refreshToken,
          accessTokenExp,
          refreshTokenExp,
        });

        await setOwner(user);

        queryClient.invalidateQueries({ queryKey: [...AUTH_QUERY_KEY, 'profile'] });
        showToast('Verification successful.. Welcome', 'Success');
        // Navigate to home
        router.replace('/home');
      } else {
        console.error('Verification failed:', response.message);
        showToast('Verification failed', 'Error');
      }
    } catch (error) {
      console.error('Verification Catch error:', error);
      showToast('Verification failed', 'Error');
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ phone: mobileNumber });
      setTimer(60);
      setCanResend(false);
      setValue('otp', '');
      console.log('Resending OTP to:', mobileNumber);
    } catch (error) {
      console.error('Resend failed:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        <View className="flex-1 justify-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-6 self-start flex-row items-center gap-x-1"
          >
            <ChevronLeft size={16} strokeWidth={2.5} color={'#a3a3a3'} />
            <Text className="text-muted-foreground/70 text-base font-medium">Back</Text>
          </TouchableOpacity>

          <View className="mb-8">
            <Text className="text-3xl font-bold text-center text-foreground mb-2">
              Verify Your Number
            </Text>
            <Text className="text-base text-center text-foreground/70">
              We sent a 6-digit code to{'\n'}
              <Text className="font-semibold">{formatBDMobile(mobileNumber)}</Text>
            </Text>
          </View>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Enter Verification Code</CardTitle>
              <CardDescription>Please enter the 6-digit code sent to your phone</CardDescription>
            </CardHeader>
            <CardContent className="gap-y-6 items-start justify-start">
              <Controller
                control={control}
                name="otp"
                rules={{ required: true, minLength: 6, maxLength: 6 }}
                render={({ field: { value, onChange } }) => (
                  <OtpInput value={value || ''} onChange={onChange} />
                )}
              />

              <Button
                onPress={handleSubmit(onSubmit)}
                disabled={otp.length !== 6 || isLoading}
                className={`w-full py-4 `}
              >
                <Text className={`text-base font-semibold text-foreground`}>
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </Text>
              </Button>
            </CardContent>
          </Card>

          <View className="items-center gap-y-3">
            <Text className="text-sm text-gray-600">Didn't receive the code?</Text>
            {canResend ? (
              <TouchableOpacity onPress={handleResend}>
                <Text className="text-blue-600 font-semibold text-base">Resend Code</Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-gray-500 text-sm">Resend in {timer}s</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
