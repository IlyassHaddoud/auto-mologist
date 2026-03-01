import { useQuery } from "@tanstack/react-query";
import { api, buildUrl, type ProductResponse, type ProductsListResponse } from "@shared/routes";

export function useProducts(filters?: { category?: string; brand?: string; isBestSeller?: string }) {
  // Construct query key based on filters to ensure caching works correctly
  const queryKey = [api.products.list.path, filters];
  
  // Construct URL with query parameters manually since the api path is static
  const url = new URL(api.products.list.path, window.location.origin);
  if (filters?.category) url.searchParams.append("category", filters.category);
  if (filters?.brand) url.searchParams.append("brand", filters.brand);
  if (filters?.isBestSeller) url.searchParams.append("isBestSeller", filters.isBestSeller);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      return api.products.list.responses[200].parse(await res.json());
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch product");
      return api.products.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
