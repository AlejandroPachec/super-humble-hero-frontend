import axios from "axios";
import { CreateSuperheroDto, Superhero } from "@/types/superhero";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100";
console.log(API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Service class for handling superhero-related API calls
 */
export class SuperheroService {
  /**
   * Fetches all superheroes sorted by humility score
   * @returns Promise<Superhero[]> Array of superheroes
   */
  static async getAllSuperheroes(): Promise<Superhero[]> {
    const { data } = await api.get<Superhero[]>("/superheroes");
    return data.map((hero) => ({
      ...hero,
      createdAt: new Date(hero.createdAt),
    }));
  }

  /**
   * Creates a new superhero
   * @param superhero The superhero data to create
   * @returns Promise<Superhero> The created superhero
   */
  static async createSuperhero(
    superhero: CreateSuperheroDto
  ): Promise<Superhero> {
    const { data } = await api.post<Superhero>("/superheroes", superhero);
    return {
      ...data,
      createdAt: new Date(data.createdAt),
    };
  }
}

export default SuperheroService;
