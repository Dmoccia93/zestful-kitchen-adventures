
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
}

const OptionCard = ({ 
  title, 
  description, 
  imageSrc, 
  colorClass,
  buttonText,
  icon
}: OptionCardProps) => {
  return (
    <Card className={`overflow-hidden border-none shadow-lg ${colorClass} h-full flex flex-col animate-scale-in card-hover`}>
      <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>
      <div className="p-6 sm:p-8 flex flex-col flex-grow">
        <h3 className="text-2xl sm:text-3xl font-bold mb-4 font-serif">{title}</h3>
        <p className="text-lg mb-6 flex-grow">{description}</p>
        <Button className="w-full py-6 bg-white text-foreground hover:bg-white/90 flex items-center justify-center gap-2 btn-hover">
          {icon && icon}
          {buttonText}
        </Button>
      </div>
    </Card>
  );
};

export default OptionCard;
