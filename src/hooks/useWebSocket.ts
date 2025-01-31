import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Superhero } from "@/types/superhero";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100";
console.log(SOCKET_URL);

interface UseWebSocketProps {
  onSuperheroCreated?: (superhero: Superhero) => void;
  onSuperheroesUpdated?: (superheroes: Superhero[]) => void;
}

/**
 * Custom hook for managing WebSocket connections and superhero-related events
 */
export const useWebSocket = ({
  onSuperheroCreated,
  onSuperheroesUpdated,
}: UseWebSocketProps = {}) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL);

    // Set up event listeners
    if (onSuperheroCreated) {
      socketRef.current.on("superheroCreated", (superhero: Superhero) => {
        onSuperheroCreated({
          ...superhero,
          createdAt: new Date(superhero.createdAt),
        });
      });
    }

    if (onSuperheroesUpdated) {
      socketRef.current.on("superheroesUpdated", (superheroes: Superhero[]) => {
        onSuperheroesUpdated(
          superheroes.map((hero) => ({
            ...hero,
            createdAt: new Date(hero.createdAt),
          }))
        );
      });
    }

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [onSuperheroCreated, onSuperheroesUpdated]);

  return socketRef.current;
};
