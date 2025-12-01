import axios from "@/lib/axios";

export const fetchSinglePost = async (title, params = {}) => {
  if (!title) throw new Error("Product title is required");

  const { ratedPostsLimit = 4 } = params;

  const queryParams = new URLSearchParams({
    title: String(title),
  });

  if (ratedPostsLimit) {
    queryParams.append("ratedPostsLimit", String(ratedPostsLimit));
  }

  try {
    const res = await axios.get(`/getSinglePostByTitle?${queryParams.toString()}`);
    return res.data || {};
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};

