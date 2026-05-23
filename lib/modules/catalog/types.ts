/** Future AC product catalog + cart. */
export type Product = {
  id: string;
  name: string;
  hp: number;
  btu: number;
  price: number;
};

export interface CatalogRepository {
  listProducts(): Promise<Product[]>;
}
