import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface TabBarIconProps {
  routeName: string;
  focused: boolean;
  color: string;
  size: number;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ routeName, focused, color, size }) => {
  let iconName = '';

  switch (routeName) {
    case 'Home':
      iconName = 'home';
      break;
    case 'Explore':
      iconName = 'explore';
      break;
    case 'History':
      iconName = 'history';
      break;
    case 'Profile':
      iconName = 'person';
      break;
    default:
      iconName = 'help';
  }

  return <Icon name={iconName} size={size} color={color} />;
};

export default TabBarIcon;