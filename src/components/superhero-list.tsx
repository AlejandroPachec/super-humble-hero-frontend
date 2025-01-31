import { Superhero } from "@/types/superhero";
import { useWebSocket } from "@/hooks/useWebSocket";
import { TrophyIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch superheroes");
  return res.json();
};

const getHumilityColor = (score: number) => {
  if (score >= 8) return "bg-green-500 dark:bg-green-600";
  if (score >= 6) return "bg-lime-500 dark:bg-lime-600";
  if (score >= 4) return "bg-yellow-500 dark:bg-yellow-600";
  if (score >= 2) return "bg-orange-500 dark:bg-orange-600";
  return "bg-red-500 dark:bg-red-600";
};

/**
 * Component to display a ranked list of superheroes with real-time updates and caching
 */
export default function SuperheroList() {
  const {
    data: superheroes,
    error,
    mutate,
  } = useSWR<Superhero[]>("/api/superheroes", fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
    dedupingInterval: 5000,
  });

  // Initialize WebSocket connection
  useWebSocket({
    onSuperheroCreated: (newHero) => {
      mutate(
        (prev: Superhero[] | undefined) =>
          prev
            ? [...prev, newHero].sort(
                (a, b) => b.humilityScore - a.humilityScore
              )
            : [newHero],
        false
      );
    },
    onSuperheroesUpdated: (updatedHeroes) => {
      mutate(updatedHeroes, false);
    },
  });

  if (error) {
    return (
      <div
        className='text-center text-red-600 dark:text-red-400 p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50'
        role='alert'>
        <p className='font-medium'>
          Failed to load superheroes. Please try again later.
        </p>
      </div>
    );
  }

  if (!superheroes) {
    return (
      <div
        className='flex justify-center items-center min-h-[200px]'
        role='status'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400'>
          <span className='sr-only'>Loading...</span>
        </div>
      </div>
    );
  }

  if (superheroes.length === 0) {
    return (
      <div
        className='text-center p-8 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700'
        role='status'>
        <p className='text-gray-500 dark:text-gray-400 font-medium'>
          No superheroes found. Be the first to add one!
        </p>
      </div>
    );
  }

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 ring-yellow-500/20";
      case 1:
        return "text-gray-400 bg-gray-50 dark:bg-gray-400/10 ring-gray-400/20";
      case 2:
        return "text-amber-600 bg-amber-50 dark:bg-amber-600/10 ring-amber-600/20";
      default:
        return "text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 ring-gray-500/10";
    }
  };

  const getRankIcon = (index: number) => {
    if (index < 3) {
      return (
        <div className={`rounded-full p-2 ring-2 ${getRankColor(index)}`}>
          <TrophyIcon className='h-6 w-6' aria-hidden='true' />
        </div>
      );
    }
    return (
      <div
        className={`rounded-full p-2 ring-2 min-w-[40px] flex items-center justify-center ${getRankColor(
          index
        )}`}>
        <span className='text-lg font-semibold'>{index + 1}</span>
      </div>
    );
  };

  return (
    <ul className='w-full flex flex-col divide-y divide-gray-200 dark:divide-gray-700/50 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden'>
      {superheroes.map((hero: Superhero, index: number) => (
        <li
          key={hero.id}
          className='group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200'>
          <div className='p-4 sm:p-6 flex items-start gap-4 sm:gap-6'>
            <div className='flex-shrink-0'>{getRankIcon(index)}</div>
            <div className='min-w-0 flex-1 flex items-start justify-between gap-4'>
              <div className='min-w-0 flex-1'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200'>
                  {hero.name}
                </h3>
                <p className='mt-1 text-gray-600 dark:text-gray-300 line-clamp-2'>
                  {hero.superpower}
                </p>
              </div>
              <div className='flex flex-col items-end gap-2 flex-shrink-0'>
                <div
                  className='flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-full whitespace-nowrap'
                  title={`Humility Score: ${hero.humilityScore}/10`}>
                  <div className='w-16 sm:w-20 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
                    <div
                      className={`h-full ${getHumilityColor(
                        hero.humilityScore
                      )} transition-all duration-300`}
                      style={{ width: `${(hero.humilityScore / 10) * 100}%` }}
                    />
                  </div>
                  <span className='text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[20px]'>
                    {hero.humilityScore}
                  </span>
                </div>
                <div className='flex items-center text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap'>
                  <CalendarDaysIcon
                    className='h-4 w-4 mr-1 flex-shrink-0'
                    aria-hidden='true'
                  />
                  <time dateTime={new Date(hero.createdAt).toISOString()}>
                    {new Date(hero.createdAt).toLocaleDateString()}
                  </time>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
