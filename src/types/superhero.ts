import { z } from "zod";

/**
 * Represents a Superhero entity with all its properties
 */
export interface Superhero {
  id: string;
  name: string;
  superpower: string;
  humilityScore: number;
  createdAt: Date;
}

/**
 * API response structure for error messages
 */
export interface ApiError {
  message: string;
  statusCode: number;
}

/**
 * Validation rules for superhero fields
 */
export const VALIDATION_RULES = {
  name: {
    min: 3,
    max: 50,
  },
  superpower: {
    min: 5,
    max: 100,
  },
  humilityScore: {
    min: 1,
    max: 10,
  },
} as const;

/**
 * Zod schema for superhero validation
 */
export const superheroSchema = z.object({
  name: z
    .string()
    .min(
      VALIDATION_RULES.name.min,
      `Name must be at least ${VALIDATION_RULES.name.min} characters`
    )
    .max(
      VALIDATION_RULES.name.max,
      `Name cannot exceed ${VALIDATION_RULES.name.max} characters`
    )
    .regex(
      /^[a-zA-Z0-9\s-]+$/,
      "Name can only contain letters, numbers, spaces, and hyphens"
    ),
  superpower: z
    .string()
    .min(
      VALIDATION_RULES.superpower.min,
      `Superpower must be at least ${VALIDATION_RULES.superpower.min} characters`
    )
    .max(
      VALIDATION_RULES.superpower.max,
      `Superpower cannot exceed ${VALIDATION_RULES.superpower.max} characters`
    ),
  humilityScore: z
    .number()
    .int("Humility score must be a whole number")
    .min(
      VALIDATION_RULES.humilityScore.min,
      `Minimum humility score is ${VALIDATION_RULES.humilityScore.min}`
    )
    .max(
      VALIDATION_RULES.humilityScore.max,
      `Maximum humility score is ${VALIDATION_RULES.humilityScore.max}`
    ),
});

/**
 * Type for creating a new superhero, derived from the Zod schema
 */
export type CreateSuperheroDto = z.infer<typeof superheroSchema>;

/**
 * Full superhero entity interface
 */
export interface Superhero extends CreateSuperheroDto {
  id: string;
  createdAt: Date;
}

/**
 * API error response interface
 */
export interface ApiError {
  message: string;
  statusCode: number;
}
