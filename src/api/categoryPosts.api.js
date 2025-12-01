import axios from "@/lib/axios";

export const fetchCategoryPosts = async (params = {}) => {
  const {
    CategoryId,
    subCategoryId,
    page = 1,
    limit = 10,
    sortField = null,
    sortOrder = null,
    is_approved = "[1]",
    is_visible = true,
    latitude,
    longitude,
    sortFields,
    is_type,
    min_sell_prices,
    max_sell_prices,
    min_rent_prices,
    max_rent_prices,
  } = params;

  if (!CategoryId) throw new Error("Category ID is required");

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    CategoryId: String(CategoryId),
    sortField: sortField ? String(sortField) : "null",
    sortOrder: sortOrder ? String(sortOrder) : "null",
    is_approved: String(is_approved),
    is_visible: String(is_visible),
  });

  if (subCategoryId) {
    queryParams.append("subCategoryId", String(subCategoryId));
  }

  if (latitude) queryParams.append("latitude", String(latitude));
  if (longitude) queryParams.append("longitude", String(longitude));
  
  // Add sorting (new format)
  if (sortFields) {
    queryParams.append("sortFields", String(sortFields));
  }
  
  // Add type filter
  if (is_type) {
    queryParams.append("is_type", String(is_type));
  }
  
  // Add price range filters
  if (min_sell_prices !== undefined && min_sell_prices !== null && min_sell_prices !== "") {
    queryParams.append("min_sell_prices", String(min_sell_prices));
  }
  if (max_sell_prices !== undefined && max_sell_prices !== null && max_sell_prices !== "") {
    queryParams.append("max_sell_prices", String(max_sell_prices));
  }
  if (min_rent_prices !== undefined && min_rent_prices !== null && min_rent_prices !== "") {
    queryParams.append("min_rent_prices", String(min_rent_prices));
  }
  if (max_rent_prices !== undefined && max_rent_prices !== null && max_rent_prices !== "") {
    queryParams.append("max_rent_prices", String(max_rent_prices));
  }

  try {
    const res = await axios.get(`/get/all/posts?${queryParams.toString()}`);
    // console.log(res.data, " category posts data");
    return res.data || {};
  } catch (error) {
    console.error("Error fetching category posts:", error);
    throw error;
  }
};

