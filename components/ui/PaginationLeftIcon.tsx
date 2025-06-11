import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const PaginationLeftIcon = (props: React.ComponentProps<typeof Svg>) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <Path d="M12.5 15L7.5 10L12.5 5" stroke="#11181C" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
); 