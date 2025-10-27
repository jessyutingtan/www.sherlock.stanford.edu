import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function DynamicIcon({ name, className = '', size = 20 }: DynamicIconProps) {
  // Get the icon component from lucide-react
  const IconComponent = (LucideIcons as any)[name];

  // If icon doesn't exist, return a default icon
  if (!IconComponent) {
    return <LucideIcons.Circle className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
}
