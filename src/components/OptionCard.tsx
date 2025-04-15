import { ReactNode } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Link } from 'react-router-dom';

interface OptionCardProps {
  title: string;
  description: string;
  imageSrc: string;
  colorClass: string;
  buttonText: string;
  icon?: ReactNode;
  imagePosition?: 'top' | 'center';
  linkTo?: string;
}

const OptionCard = ({
  title,
  description,
  imageSrc,
  colorClass,
  buttonText,
  icon,
  imagePosition = 'center',
  linkTo
}: OptionCardProps) => {
  const ButtonContent = () => (
    <>
      {icon && icon}
      {buttonText}
    </>
  );

  return (
    <Card
      className={`rounded-lg border text-card-foreground overflow-hidden border-none shadow-md bg-${colorClass} h-full flex flex-col relative ${
        title.includes("weekly") ? 'opacity-60' : ''
      }`}
    >
      {title.includes("weekly") && (
        <div className="absolute inset-0 bg-white opacity-40 pointer-events-none"></div>
      )}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className={`w-full h-full object-cover object-center ${
            title.includes("weekly") ? 'filter grayscale-[80%] brightness-75' : ''
          }`}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl sm:text-2xl font-bold mb-3">{title}</h3>
        {title.includes("weekly") && (
          <span className="text-red-500 font-semibold text-sm sm:text-base">(Coming Soon)</span>
        )}
        <p className="text-sm sm:text-base mb-6 flex-grow">{description}</p>

        {linkTo ? (
          <Link to={linkTo} className="w-full">
            <Button className="w-full py-5 bg-white text-foreground hover:bg-white/90 flex items-center justify-center gap-2">
              <ButtonContent />
            </Button>
          </Link>
        ) : (
          <Button className="w-full py-5 bg-white text-foreground hover:bg-white/90 flex items-center justify-center gap-2">
            <ButtonContent />
          </Button>
        )}
      </div>
    </Card>
  );
};

export default OptionCard;