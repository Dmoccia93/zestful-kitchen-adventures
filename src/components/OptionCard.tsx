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

  const cardClassName = `overflow-hidden border-none shadow-md h-full flex flex-col relative ${
    !title.includes("weekly") ? 'transition-transform transform hover:scale-105 cursor-pointer' : ''
  }`;

  return (
    <>
      {!title.includes("weekly") && linkTo ? (
        <Link to={linkTo} className="w-full h-full block">
          <Card className={cardClassName}>
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <img
                src={imageSrc}
                alt={title}
                loading="eager"
                className={`w-full h-full object-cover object-center`}
              />
            </div>
            <div className={`p-6 flex flex-col flex-grow ${colorClass}`}>
              <h3 className="text-xl sm:text-2xl font-bold mb-3">{title}</h3>
              <p className="text-sm sm:text-base mb-6 flex-grow">{description}</p>
              <Button className="w-full py-5 bg-white text-foreground hover:bg-white/90 flex items-center justify-center gap-2">
                <ButtonContent />
              </Button>
            </div>
          </Card>
        </Link>
      ) : (
        <Card className={cardClassName}>
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <img
              src={imageSrc}
              alt={title}
              loading="eager"
              className={`w-full h-full object-cover object-center ${
                title.includes("weekly") ? 'filter grayscale-[80%] brightness-75 opacity-40' : ''
              }`}
            />
            {title.includes("weekly") && (
              <div className="absolute top-0 left-0 w-full bg-red-500 text-white py-2 text-center text-xs font-bold">
                COMING SOON
              </div>
            )}
          </div>
          <div className={`p-6 flex flex-col flex-grow ${colorClass} ${title.includes("weekly") ? 'opacity-40' : ''}`}>
            <h3 className="text-xl sm:text-2xl font-bold mb-3">{title}</h3>
            <p className="text-sm sm:text-base mb-6 flex-grow">{description}</p>
            <Button className="w-full py-5 bg-white text-foreground hover:bg-white/90 flex items-center justify-center gap-2">
              <ButtonContent />
            </Button>
            {linkTo && title.includes("weekly") && (
              <Link to={linkTo} className="w-full mt-2">
                <Button className="w-full py-5 bg-white text-foreground hover:bg-white/90 flex items-center justify-center gap-2">
                  <ButtonContent />
                </Button>
              </Link>
            )}
          </div>
        </Card>
      )}
    </>
  );
};

export default OptionCard;