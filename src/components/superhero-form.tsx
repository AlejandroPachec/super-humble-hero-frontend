import { useState } from "react";
import { CreateSuperheroDto, VALIDATION_RULES } from "@/types/superhero";
import SuperheroService from "@/services/api";
import toast from "react-hot-toast";

interface SuperheroFormProps {
  onSuccess?: () => void;
}

/**
 * Form component for creating new superheroes
 */
export default function SuperheroForm({ onSuccess }: SuperheroFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateSuperheroDto>({
    name: "",
    superpower: "",
    humilityScore: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await SuperheroService.createSuperhero(formData);
      toast.success("Superhero created successfully!");
      setFormData({ name: "", superpower: "", humilityScore: 5 });
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create superhero. Please try again.");
      console.error("Error creating superhero:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
      <div>
        <label
          htmlFor='name'
          className='block text-sm font-medium text-gray-700'>
          Name
        </label>
        <input
          type='text'
          id='name'
          required
          minLength={VALIDATION_RULES.name.min}
          maxLength={VALIDATION_RULES.name.max}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          placeholder='Enter superhero name'
        />
      </div>

      <div>
        <label
          htmlFor='superpower'
          className='block text-sm font-medium text-gray-700'>
          Superpower
        </label>
        <input
          type='text'
          id='superpower'
          required
          minLength={VALIDATION_RULES.superpower.min}
          maxLength={VALIDATION_RULES.superpower.max}
          value={formData.superpower}
          onChange={(e) =>
            setFormData({ ...formData, superpower: e.target.value })
          }
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          placeholder='Enter superpower'
        />
      </div>

      <div>
        <label
          htmlFor='humilityScore'
          className='block text-sm font-medium text-gray-700'>
          Humility Score (1-10)
        </label>
        <input
          type='range'
          id='humilityScore'
          min={VALIDATION_RULES.humilityScore.min}
          max={VALIDATION_RULES.humilityScore.max}
          value={formData.humilityScore}
          onChange={(e) =>
            setFormData({
              ...formData,
              humilityScore: parseInt(e.target.value),
            })
          }
          className='mt-1 block w-full'
        />
        <span className='block text-center text-sm text-gray-600'>
          Current score: {formData.humilityScore}
        </span>
      </div>

      <button
        type='submit'
        disabled={isSubmitting}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
          ${
            isSubmitting ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
          }
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
        {isSubmitting ? "Creating..." : "Create Superhero"}
      </button>
    </form>
  );
}
