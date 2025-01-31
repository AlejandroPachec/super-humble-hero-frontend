"use client";

import { Toaster } from "react-hot-toast";
import SuperheroForm from "@/components/superhero-form";
import SuperheroList from "@/components/superhero-list";

/**
 * Main page component for the Humble Superhero application
 */
export default function Home() {
  return (
    <main className='min-h-screen bg-gray-50'>
      <Toaster position='top-right' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Humble Superhero Registry
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Welcome to our community of humble superheroes! Add your powers and
            join others in making the world a better place, one humble act at a
            time.
          </p>
        </div>

        <div className='grid gap-12 lg:grid-cols-[400px,1fr] items-start'>
          <div className='lg:sticky lg:top-8'>
            <div className='bg-white rounded-lg shadow-lg p-6'>
              <h2 className='text-2xl font-semibold text-gray-900 mb-6'>
                Register as a Superhero
              </h2>
              <SuperheroForm />
            </div>
          </div>

          <div>
            <h2 className='text-2xl font-semibold text-gray-900 mb-6'>
              Our Humble Heroes
            </h2>
            <SuperheroList />
          </div>
        </div>
      </div>
    </main>
  );
}
