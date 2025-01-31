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
 * Data transfer object for creating a new superhero
 */
export interface CreateSuperheroDto {
  name: string;
  superpower: string;
  humilityScore: number;
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
