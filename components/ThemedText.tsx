import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  variant?:
    | 'text-xs-regular'  | 'text-xs-medium'  | 'text-xs-semibold'  | 'text-xs-bold'
    | 'text-sm-regular'  | 'text-sm-medium'  | 'text-sm-semibold'  | 'text-sm-bold'
    | 'text-base-regular'| 'text-base-medium'| 'text-base-semibold'| 'text-base-bold'
    | 'text-lg-regular'  | 'text-lg-medium'  | 'text-lg-semibold'  | 'text-lg-bold'
    | 'text-xl-regular'  | 'text-xl-medium'  | 'text-xl-semibold'  | 'text-xl-bold'
    | 'text-2xl-regular' | 'text-2xl-medium' | 'text-2xl-semibold' | 'text-2xl-bold'
    | 'text-3xl-regular' | 'text-3xl-medium' | 'text-3xl-semibold' | 'text-3xl-bold'
    | 'text-4xl-regular' | 'text-4xl-medium' | 'text-4xl-semibold' | 'text-4xl-bold'
    | 'text-5xl-regular' | 'text-5xl-medium' | 'text-5xl-semibold' | 'text-5xl-bold'
    | 'text-6xl-regular' | 'text-6xl-medium' | 'text-6xl-semibold' | 'text-6xl-bold'
    | 'text-7xl-regular' | 'text-7xl-medium' | 'text-7xl-semibold' | 'text-7xl-bold';
};

export const ThemedText: React.FC<ThemedTextProps> = ({
  style,
  lightColor,
  darkColor,
  type = 'default',
  variant,
  ...rest
}) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const textStyle = variant ? styles[variant] : {};
  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        textStyle,
        style,
      ]}
      {...rest}
    />
  );
};


const styles = StyleSheet.create({
  default: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    lineHeight: Platform.OS === 'web' ? 28 : 24,
    fontFamily: 'Inter',
  },
  defaultSemiBold: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    lineHeight: Platform.OS === 'web' ? 28 : 24,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  title: {
    fontSize: Platform.OS === 'web' ? 36 : 32,
    fontWeight: 'bold',
    lineHeight: Platform.OS === 'web' ? 44 : 40,
    fontFamily: 'Inter',
  },
  subtitle: {
    fontSize: Platform.OS === 'web' ? 24 : 20,
    fontWeight: 'bold',
    lineHeight: Platform.OS === 'web' ? 32 : 28,
    fontFamily: 'Inter',
  },
  link: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    lineHeight: Platform.OS === 'web' ? 28 : 24,
    color: '#0a7ea4',
    fontFamily: 'Inter',
  },
  'text-xs-regular': {
    fontSize: Platform.OS === 'web' ? 14 : 12,
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  'text-xs-medium': {
    fontSize: Platform.OS === 'web' ? 14 : 12,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  'text-xs-semibold': {
    fontSize: Platform.OS === 'web' ? 14 : 12,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  'text-xs-bold': {
    fontSize: Platform.OS === 'web' ? 14 : 12,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  'text-sm-regular': {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  'text-sm-medium': {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  'text-sm-semibold': {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  'text-sm-bold': {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  'text-base-regular': {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  'text-base-medium': {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  'text-base-semibold': {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  'text-base-bold': {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  'text-lg-regular': {
    fontSize: Platform.OS === 'web' ? 20 : 18,
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  'text-lg-medium': {
    fontSize: Platform.OS === 'web' ? 20 : 18,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  'text-lg-semibold': {
    fontSize: Platform.OS === 'web' ? 20 : 18,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  'text-lg-bold': {
    fontSize: Platform.OS === 'web' ? 20 : 18,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  'text-xl-regular': {
    fontSize: Platform.OS === 'web' ? 24 : 20,
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  'text-xl-medium': {
    fontSize: Platform.OS === 'web' ? 24 : 20,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  'text-xl-semibold': {
    fontSize: Platform.OS === 'web' ? 24 : 20,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  'text-xl-bold': {
    fontSize: Platform.OS === 'web' ? 24 : 20,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  'text-2xl-regular': {
    fontSize: Platform.OS === 'web' ? 28 : 24,
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  'text-2xl-medium': {
    fontSize: Platform.OS === 'web' ? 28 : 24,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  'text-2xl-semibold': {
    fontSize: Platform.OS === 'web' ? 28 : 24,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  'text-2xl-bold': {
    fontSize: Platform.OS === 'web' ? 28 : 24,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  'text-3xl-regular': {
    fontSize: Platform.OS === 'web' ? 32 : 28,
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  'text-3xl-medium': {
    fontSize: Platform.OS === 'web' ? 32 : 28,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  'text-3xl-semibold': {
    fontSize: Platform.OS === 'web' ? 32 : 28,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  'text-3xl-bold': {
    fontSize: Platform.OS === 'web' ? 32 : 28,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  'text-4xl-regular': {
    fontSize: Platform.OS === 'web' ? 36 : 32,
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  'text-4xl-medium': {
    fontSize: Platform.OS === 'web' ? 36 : 32,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  'text-4xl-semibold': {
    fontSize: Platform.OS === 'web' ? 36 : 32,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  'text-4xl-bold': {
    fontSize: Platform.OS === 'web' ? 36 : 32,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  'text-5xl-regular': {
    fontSize: Platform.OS === 'web' ? 44 : 40,
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  'text-5xl-medium': {
    fontSize: Platform.OS === 'web' ? 44 : 40,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  'text-5xl-semibold': {
    fontSize: Platform.OS === 'web' ? 44 : 40,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  'text-5xl-bold': {
    fontSize: Platform.OS === 'web' ? 44 : 40,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  'text-6xl-regular': {
    fontSize: Platform.OS === 'web' ? 52 : 48,
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  'text-6xl-medium': {
    fontSize: Platform.OS === 'web' ? 52 : 48,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  'text-6xl-semibold': {
    fontSize: Platform.OS === 'web' ? 52 : 48,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  'text-6xl-bold': {
    fontSize: Platform.OS === 'web' ? 52 : 48,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  'text-7xl-regular': {
    fontSize: Platform.OS === 'web' ? 60 : 56,
    fontWeight: '400',
    fontFamily: 'Inter',
  },
  'text-7xl-medium': {
    fontSize: Platform.OS === 'web' ? 60 : 56,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  'text-7xl-semibold': {
    fontSize: Platform.OS === 'web' ? 60 : 56,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  'text-7xl-bold': {
    fontSize: Platform.OS === 'web' ? 60 : 56,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
});
