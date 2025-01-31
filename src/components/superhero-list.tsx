import { Superhero } from "@/types/superhero";
import { useWebSocket } from "@/hooks/useWebSocket";
import { StarIcon } from "@heroicons/react/24/solid";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch superheroes");
  return res.json();
};

/**
 * Component to display a list of superheroes with real-time updates and caching
 */
export default function SuperheroList() {
  const {
    data: superheroes,
    error,
    mutate,
  } = useSWR<Superhero[]>("/api/superheroes", fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
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
        className='text-center text-red-600 p-4 bg-red-50 rounded-lg'
        role='alert'>
        Failed to load superheroes. Please try again later.
      </div>
    );
  }

  if (!superheroes) {
    return (
      <div
        className='flex justify-center items-center min-h-[200px]'
        role='status'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'>
          <span className='sr-only'>Loading...</span>
        </div>
      </div>
    );
  }

  if (superheroes.length === 0) {
    return (
      <div className='text-center text-gray-500 p-4' role='status'>
        No superheroes found. Be the first to add one!
      </div>
    );
  }

  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {superheroes.map((hero: Superhero) => (
        <article
          key={hero.id}
          className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
          <div className='flex items-start justify-between'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900'>
                {hero.name}
              </h3>
              <p className='text-gray-600 mt-1'>{hero.superpower}</p>
            </div>
            <div
              className='flex items-center'
              title={`Humility Score: ${hero.humilityScore}`}>
              <StarIcon
                className='h-5 w-5 text-yellow-400'
                aria-hidden='true'
              />
              <span className='ml-1 text-sm font-medium text-gray-700'>
                {hero.humilityScore}
              </span>
            </div>
          </div>
          <time
            className='mt-4 block text-sm text-gray-500'
            dateTime={new Date(hero.createdAt).toISOString()}>
            Added {new Date(hero.createdAt).toLocaleDateString()}
          </time>
        </article>
      ))}
    </div>
  );
}
