import { z } from 'zod';


// #/components/schemas/Pet
export const PetZod = z.object({
    id: z.number(),
    name: z.string(),
    tag: z.string().optional(),
});
export type PetType = z.TypeOf<typeof PetZod>;


// #/components/schemas/Pets
export const PetsZod = z.array(PetZod);
export type PetsType = z.TypeOf<typeof PetsZod>;

