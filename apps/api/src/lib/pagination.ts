export interface PageQuery {
  page: number;
  limit: number;
}

export function skipFor({ page, limit }: PageQuery): number {
  return (page - 1) * limit;
}

export function pageMeta({ page, limit }: PageQuery, total: number) {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
}
