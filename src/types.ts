export interface Pokemon {
  name: string;
  id: number;
  sprites: {
    other: {
      home: {
        front_default: string;
        front_shiny: string;
      };
    };
  };
  types: [
    { slot: 1; type: { name: string } },
    { slot: 2; type: { name: string } }?
  ];
  height: number;
  weight: number;
  flavor_text_entries: [{ slot: 1; type: { flavor_text: string } }];
}
