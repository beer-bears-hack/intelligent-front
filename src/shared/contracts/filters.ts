import { z } from 'zod'

export const stringArray = z.array(z.string())
export type StringArray = z.infer<typeof stringArray>

export type ManufacturersResponse = StringArray
export type CategoriesResponse = StringArray
