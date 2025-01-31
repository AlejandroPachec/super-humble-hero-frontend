import { useState } from "react";
import {
  CreateSuperheroDto,
  VALIDATION_RULES,
  superheroSchema,
} from "@/types/superhero";
import SuperheroService from "@/services/api";
import toast from "react-hot-toast";
import { UserCircleIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { z } from "zod";

interface SuperheroFormProps {
  onSuccess?: () => void;
}

const getHumilityColor = (score: number) => {
  if (score >= 8) return "bg-green-500 dark:bg-green-600";
  if (score >= 6) return "bg-lime-500 dark:bg-lime-600";
  if (score >= 4) return "bg-yellow-500 dark:bg-yellow-600";
  if (score >= 2) return "bg-orange-500 dark:bg-orange-600";
  return "bg-red-500 dark:bg-red-600";
};

/**
 * Form component for creating new superheroes with Zod validation
 */
export default function SuperheroForm({ onSuccess }: SuperheroFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateSuperheroDto>({
    name: "",
    superpower: "",
    humilityScore: 5,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (
    field: keyof CreateSuperheroDto,
    value: string | number
  ) => {
    try {
      superheroSchema.shape[field].parse(value);
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.errors[0].message,
        }));
      }
    }
  };

  const handleChange = (
    field: keyof CreateSuperheroDto,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = superheroSchema.parse(formData);
      await SuperheroService.createSuperhero(validatedData);
      toast.success("Superhero created successfully!");
      setFormData({ name: "", superpower: "", humilityScore: 5 });
      setErrors({});
      onSuccess?.();
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error("Please fix the validation errors");
      } else {
        toast.error("Failed to create superhero. Please try again.");
        console.error("Error creating superhero:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (field: keyof CreateSuperheroDto) => `
    pl-10 block h-12 w-full rounded-lg 
    ${
      errors[field]
        ? "border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500"
        : "border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
    }
    bg-white dark:bg-gray-700 
    text-gray-900 dark:text-white
    shadow-sm 
    dark:focus:border-indigo-400 dark:focus:ring-indigo-400
    dark:placeholder-gray-400 
    transition-colors duration-200
  `;

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      <div className='space-y-6'>
        {/* Name Input Group */}
        <div className='space-y-1'>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Name
          </label>
          <div className='relative mt-1'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <UserCircleIcon
                className={`h-5 w-5 ${
                  errors.name
                    ? "text-red-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
                aria-hidden='true'
              />
            </div>
            <input
              type='text'
              id='name'
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={getInputClassName("name")}
              placeholder='Superhero name'
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                <ExclamationCircleIcon
                  className='h-5 w-5 text-red-500'
                  aria-hidden='true'
                />
              </div>
            )}
          </div>
          <div className='min-h-[20px]'>
            {errors.name && (
              <p
                className='text-sm text-red-600 dark:text-red-400'
                id='name-error'>
                {errors.name}
              </p>
            )}
          </div>
        </div>

        {/* Superpower Input Group */}
        <div className='space-y-1'>
          <label
            htmlFor='superpower'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Superpower
          </label>
          <div className='relative mt-1'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <SparklesIcon
                className={`h-5 w-5 ${
                  errors.superpower
                    ? "text-red-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
                aria-hidden='true'
              />
            </div>
            <input
              type='text'
              id='superpower'
              value={formData.superpower}
              onChange={(e) => handleChange("superpower", e.target.value)}
              className={getInputClassName("superpower")}
              placeholder='What makes you special?'
              aria-invalid={!!errors.superpower}
              aria-describedby={
                errors.superpower ? "superpower-error" : undefined
              }
            />
            {errors.superpower && (
              <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                <ExclamationCircleIcon
                  className='h-5 w-5 text-red-500'
                  aria-hidden='true'
                />
              </div>
            )}
          </div>
          <div className='min-h-[20px]'>
            {errors.superpower && (
              <p
                className='text-sm text-red-600 dark:text-red-400'
                id='superpower-error'>
                {errors.superpower}
              </p>
            )}
          </div>
        </div>

        {/* Humility Score Input Group */}
        <div className='space-y-3'>
          <label
            htmlFor='humilityScore'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Humility Score
          </label>
          <div className='flex items-center gap-4'>
            <input
              type='range'
              id='humilityScore'
              value={formData.humilityScore}
              onChange={(e) =>
                handleChange("humilityScore", parseInt(e.target.value))
              }
              className='flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400'
              min={VALIDATION_RULES.humilityScore.min}
              max={VALIDATION_RULES.humilityScore.max}
              aria-invalid={!!errors.humilityScore}
              aria-describedby={
                errors.humilityScore ? "humility-error" : undefined
              }
            />
            <div className='flex items-center gap-2 min-w-[100px]'>
              <div className='w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
                <div
                  className={`h-full ${getHumilityColor(
                    formData.humilityScore
                  )} transition-all duration-300`}
                  style={{ width: `${(formData.humilityScore / 10) * 100}%` }}
                />
              </div>
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[24px]'>
                {formData.humilityScore}
              </span>
            </div>
          </div>
          <div className='min-h-[20px]'>
            {errors.humilityScore && (
              <p
                className='text-sm text-red-600 dark:text-red-400'
                id='humility-error'>
                {errors.humilityScore}
              </p>
            )}
          </div>
          <div className='flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1'>
            <span>Not humble</span>
            <span>Very humble</span>
          </div>
        </div>
      </div>

      <button
        type='submit'
        disabled={isSubmitting || Object.keys(errors).length > 0}
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white 
          ${
            isSubmitting || Object.keys(errors).length > 0
              ? "bg-indigo-400 dark:bg-indigo-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          }
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
          dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-[1.02]`}>
        {isSubmitting ? "Creating..." : "Create Superhero"}
      </button>
    </form>
  );
}
