import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  icon: string;
  color?: "primary" | "accent";
}

export function StepCard({
  step,
  title,
  description,
  icon,
  color = "primary",
}: StepCardProps) {
  const colorMap = {
    primary: {
      text: "text-primary",
      bgSoft: "bg-primary/20",
      step: "text-primary/30",
    },
    accent: {
      text: "text-accent",
      bgSoft: "bg-accent/20",
      step: "text-accent/30",
    },
  };

  return (
    <div>
      <Card
        className='
          glass-brutal rounded-3xl
          relative h-full
          transition-bounce
          group hover:-translate-y-2
        '
      >
        {/* Step Number (Card 기준) */}
        <div
          className={cn(
            "absolute -top-10 -left-4 text-[96px] font-black leading-none select-none pointer-events-none",
            colorMap[color].step
          )}
        >
          {step}
        </div>

        <CardContent className='p-8'>
          {/* Icon */}
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-bounce group-hover:scale-110",
              colorMap[color].bgSoft
            )}
          >
            <span
              className={cn(
                "material-symbols-outlined text-3xl",
                colorMap[color].text
              )}
            >
              {icon}
            </span>
          </div>

          <CardTitle className='text-2xl font-bold mb-3'>{title}</CardTitle>

          <CardDescription className='text-muted-foreground leading-relaxed text-base'>
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

export default StepCard;
