import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradientClass: string;
  tags?: string[];
}

export function FeatureCard({
  icon,
  title,
  description,
  gradientClass,
  tags,
}: FeatureCardProps) {
  return (
    <Card
      className='
        glass-brutal rounded-3xl
        transition-all duration-500
        hover:shadow-dramatic
        group
      '
    >
      <CardContent className='p-8'>
        {/* Icon */}
        <div
          className={`
            w-16 h-16 rounded-2xl ${gradientClass}
            flex items-center justify-center mb-6
            group-hover:scale-110 transition-bounce
          `}
        >
          <span className='material-symbols-outlined text-white text-3xl'>
            {icon}
          </span>
        </div>

        {/* Title */}
        <CardTitle className='text-2xl font-bold mb-3'>{title}</CardTitle>

        {/* Description */}
        <CardDescription className='text-muted-foreground leading-relaxed text-base'>
          {description}
        </CardDescription>

        {/* Tags */}
        {tags && (
          <div className='mt-8 flex gap-3 flex-wrap'>
            {tags.map(tag => (
              <span
                key={tag}
                className='px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold'
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default FeatureCard;
