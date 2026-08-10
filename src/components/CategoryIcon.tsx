import React from 'react';
import {
  Utensils,
  ShoppingBag,
  Home,
  Car,
  Zap,
  Film,
  HeartPulse,
  Briefcase,
  TrendingUp,
  Laptop,
  Coffee,
  GraduationCap,
  Plane,
  Gift,
  Dumbbell,
  Smartphone,
  Tag,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  iconName: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName, ...props }) => {
  switch (iconName) {
    case 'Utensils':
      return <Utensils {...props} />;
    case 'ShoppingBag':
      return <ShoppingBag {...props} />;
    case 'Home':
      return <Home {...props} />;
    case 'Car':
      return <Car {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    case 'Film':
      return <Film {...props} />;
    case 'HeartPulse':
      return <HeartPulse {...props} />;
    case 'Briefcase':
      return <Briefcase {...props} />;
    case 'TrendingUp':
      return <TrendingUp {...props} />;
    case 'Laptop':
      return <Laptop {...props} />;
    case 'Coffee':
      return <Coffee {...props} />;
    case 'GraduationCap':
      return <GraduationCap {...props} />;
    case 'Plane':
      return <Plane {...props} />;
    case 'Gift':
      return <Gift {...props} />;
    case 'Dumbbell':
      return <Dumbbell {...props} />;
    case 'Smartphone':
      return <Smartphone {...props} />;
    case 'Tag':
      return <Tag {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
};
