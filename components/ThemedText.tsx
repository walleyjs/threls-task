import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  variant?:
    | 'text-7xl-regular' | 'text-7xl-medium' | 'text-7xl-semibold' | 'text-7xl-bold'
    | 'text-6xl-regular' | 'text-6xl-medium' | 'text-6xl-semibold' | 'text-6xl-bold'
    | 'text-5xl-regular' | 'text-5xl-medium' | 'text-5xl-semibold' | 'text-5xl-bold'
    | 'text-4xl-regular' | 'text-4xl-medium' | 'text-4xl-semibold' | 'text-4xl-bold'
    | 'text-3xl-regular' | 'text-3xl-medium' | 'text-3xl-semibold' | 'text-3xl-bold'
    | 'text-2xl-regular' | 'text-2xl-medium' | 'text-2xl-semibold' | 'text-2xl-bold'
    | 'text-xl-regular'  | 'text-xl-medium'  | 'text-xl-semibold'  | 'text-xl-bold'
    | 'text-lg-regular'  | 'text-lg-medium'  | 'text-lg-semibold'  | 'text-lg-bold'
    | 'text-base-regular'| 'text-base-medium'| 'text-base-semibold'| 'text-base-bold'
    | 'text-sm-regular'  | 'text-sm-medium'  | 'text-sm-semibold'  | 'text-sm-bold'
    | 'text-xs-regular'  | 'text-xs-medium'  | 'text-xs-semibold'  | 'text-xs-bold';
};

const fontSizeMap = {
  'text-7xl': 48,
  'text-6xl': 40,
  'text-5xl': 32,
  'text-4xl': 28,
  'text-3xl': 24,
  'text-2xl': 20,
  'text-xl': 18,
  'text-lg': 16,
  'text-base': 14,
  'text-sm': 12,
  'text-xs': 10,
};

const fontWeightMap = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

function getVariantStyle(variant?: string) {
  if (!variant) return undefined;
  const match = variant.match(/^text-(7xl|6xl|5xl|4xl|3xl|2xl|xl|lg|base|sm|xs)-(regular|medium|semibold|bold)$/);
  if (!match) return undefined;
  const size = `text-${match[1]}` as keyof typeof fontSizeMap;
  const weight = match[2] as keyof typeof fontWeightMap;
  return {
    fontSize: fontSizeMap[size],
    fontWeight: fontWeightMap[weight],
    lineHeight: Math.round(fontSizeMap[size] * 1.25),
  };
}

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  variant,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  return (
    <Text
      style={[
        { color },
        getVariantStyle(variant),
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
