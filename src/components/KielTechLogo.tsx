import React from 'react';

interface KielTechLogoProps {
  className?: string;
  size?: number | string;
  alt?: string;
}

export const KielTechLogo: React.FC<KielTechLogoProps> = ({
  className = 'h-11 w-11',
  alt = 'KielTech Official Logo',
}) => {
  return (
    <img
      src="/kieltech-k.png"
      alt={alt}
      className={`object-contain shrink-0 ${className}`}
      loading="eager"
    />
  );
};
