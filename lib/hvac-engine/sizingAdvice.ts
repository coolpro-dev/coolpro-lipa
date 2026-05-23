/** Catalog HP steps for residential wall/window units (Philippines market). */
const HP_CATALOG = [0.75, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5] as const;
const BTU_PER_HP = 9000;

export type SizingAdvice = {
  catalogHp: number;
  catalogBtu: number;
  status: "ok" | "undersized" | "oversized";
  message: string;
};

function pickCatalogHp(targetBtu: number): number {
  for (const hp of HP_CATALOG) {
    if (hp * BTU_PER_HP >= targetBtu * 0.95) return hp;
  }
  return HP_CATALOG[HP_CATALOG.length - 1];
}

/**
 * Compare calculated load to nearest catalog HP band.
 * Engine already includes 15% safety buffer in totalBtu.
 */
export function getSizingAdvice(totalBtu: number, totalHp: number): SizingAdvice {
  const catalogHp = pickCatalogHp(totalBtu);
  const catalogBtu = catalogHp * BTU_PER_HP;
  const ratio = catalogBtu / totalBtu;

  if (ratio < 0.9) {
    return {
      catalogHp,
      catalogBtu,
      status: "undersized",
      message: `A ${catalogHp} HP unit may struggle — calculated need is ~${totalHp} HP (${Math.round(totalBtu).toLocaleString()} BTU/hr). Consider the next size up or a site survey.`,
    };
  }
  if (ratio > 1.3) {
    return {
      catalogHp,
      catalogBtu,
      status: "oversized",
      message: `A ${catalogHp} HP unit may be oversized for ~${totalHp} HP load — short cycling and higher bills are possible. A site survey can confirm the right match.`,
    };
  }
  return {
    catalogHp,
    catalogBtu,
    status: "ok",
    message: `A ${catalogHp} HP unit (${Math.round(catalogBtu).toLocaleString()} BTU/hr) is a reasonable match for your estimated load.`,
  };
}
