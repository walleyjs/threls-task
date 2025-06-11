import React from 'react';
import { Image, ImageProps } from 'react-native';

export const LogoImage = (props: ImageProps) => (
  <Image source={require('@/assets/images/logo_.png')} style={{ width: 80, height: 32, resizeMode: 'contain' }} {...props} />
); 