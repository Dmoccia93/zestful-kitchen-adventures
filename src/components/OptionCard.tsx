
import { ReactNode } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface OptionCardProps {
  title: string;
  description: string;
  imageSrc: string;
  colorClass: string;
  buttonText: string;
  icon?: ReactNode;
  imagePosition?: 'top' | 'center';
}

const OptionCard = ({ 
  title, 
  description, 
  imageSrc, 
  colorClass,
  buttonText,
  icon,
  imagePosition = 'center'
}: OptionCardProps) => {
  return (
    <Card className={`overflow-hidden border-none shadow-md ${colorClass} h-full flex flex-col`}>
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img 
          src={imageSrc} 
          alt={title} 
          className={`w-full h-full object-cover ${imagePosition === 'center' ? 'object-center' : 'object-top'}`}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl sm:text-2xl font-bold mb-3">{title}</h3>
        <p className="text-sm sm:text-base mb-6 flex-grow">{description}</p>
        <Button className="w-full py-5 bg-white text-foreground hover:bg-white/90 flex items-center justify-center gap-2">
          {icon && icon}
          {buttonText}
        </Button>
      </div>
    </Card>
  );
};

export default OptionCard;
