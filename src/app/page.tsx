"use client";

import { Toaster } from "react-hot-toast";
import SuperheroForm from "@/components/superhero-form";
import SuperheroList from "@/components/superhero-list";
import { useEffect } from "react";

/**
 * Main page component for the Humble Superhero application
 */
export default function Home() {
  // Enable dark mode by default
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200'>
      <Toaster
        position='top-right'
        toastOptions={{
          className: "dark:bg-gray-800 dark:text-white",
        }}
      />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        <div className='text-center mb-8 sm:mb-12'>
          <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            Super Humble Heroes Registry
          </h1>
          <p className='text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4'>
            Welcome to our community of super humble heroes! Add your superhero
            powers and join others in making the world a better place,{" "}
            <strong>one humble act at a time.</strong>
          </p>
        </div>

        <div className='grid gap-8 lg:grid-cols-[minmax(auto,400px),1fr] items-start'>
          <div className='w-full lg:sticky lg:top-8'>
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6'>
              <h2 className='text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6 sm:mb-8'>
                Register a Superhero
              </h2>
              <SuperheroForm />
            </div>
          </div>

          <div className='w-full overflow-hidden'>
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6'>
              <h2 className='text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6'>
                Our Humble Heroes Ranked
              </h2>
              <div className='overflow-x-auto'>
                <SuperheroList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
