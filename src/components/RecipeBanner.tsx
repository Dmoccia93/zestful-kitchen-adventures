
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Flame, LeafyGreen } from "lucide-react";

interface RecipeBannerProps {
  title: string;
  subtitle?: string;
  cookTime?: number;
  prepTime?: number;
  calories?: number;
  tags?: string[];
  onClick?: () => void;
}

const RecipeBanner: React.FC<RecipeBannerProps> = ({
  title,
  subtitle,
  cookTime,
  prepTime,
  calories,
  tags = [],
  onClick
}) => {
  return (
    <Card 
      className="w-full cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-serif font-semibold text-left">{title}</h3>
            {subtitle && (
              <p className="text-muted-foreground mt-1 text-left">{subtitle}</p>
            )}
          </div>

          <div className="flex gap-4 text-sm text-muted-foreground">
            {cookTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{cookTime} min</span>
              </div>
            )}
            {prepTime && (
              <div className="flex items-center gap-1">
                <LeafyGreen className="h-4 w-4" />
                <span>{prepTime} min</span>
              </div>
            )}
            {calories && (
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4" />
                <span>{calories} kcal</span>
              </div>
            )}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="rounded-full bg-secondary/50"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeBanner;
