import React from 'react';
import { Image, ImageProps } from 'react-native';

export const CartIcon = (props: ImageProps) => (
  <Image source={require('@/assets/images/shoppingCart.png')} style={{ width: 28, height: 28, resizeMode: 'contain' }} {...props} />
); 