import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const PaginationRightIcon = (props: React.ComponentProps<typeof Svg>) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <Path d="M7.5 5L12.5 10L7.5 15" stroke="#11181C" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
); 