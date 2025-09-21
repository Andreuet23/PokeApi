import type { Pokemon } from "../types";

const BASE_URL = "https://pokeapi.co/api/v2";

export async function getPokemon(id: number): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!res.ok) throw new Error("Can't fetch Pokémon data");
  return res.json();
}

export async function getPokemonCount(): Promise<number> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=1`);
  if (!res.ok) throw new Error("Can't fetch Pokémon count");
  const data = await res.json();
  return data.count as number;
}

export async function getPokemonDescription(
  id: number,
  lang: "es" | "en" = "es"
): Promise<string> {
  const res = await fetch(`${BASE_URL}/pokemon-species/${id}`);
  if (!res.ok) throw new Error("Can't fetch Pokémon description");

  const data: {
    flavor_text_entries: {
      flavor_text: string;
      language: { name: string };
      version: { name: string };
    }[];
  } = await res.json();

  const entry =
    data.flavor_text_entries.find((e) => e.language.name === lang) ??
    data.flavor_text_entries.find((e) => e.language.name === "en");

  const clean = (s: string) =>
    s
      .replace(/[\n\r\f]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  return entry ? clean(entry.flavor_text) : "No description available.";
}
