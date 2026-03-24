import { PersonalityType } from '@/types';
import PersonalityCard from './PersonalityCard';

interface TypeGridProps {
  personalities: PersonalityType[];
  title?: string;
}

export default function TypeGrid({ personalities, title }: TypeGridProps) {
  return (
    <div className="space-y-8">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {personalities.map((personality) => (
          <PersonalityCard key={personality.type} personality={personality} />
        ))}
      </div>
    </div>
  );
}
