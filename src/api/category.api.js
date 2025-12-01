import axios from "@/lib/axios";

export const fetchCategoryData = async () => {
  const res = await axios.get("/get/all/Categories/With/SubCategory");
  console.log(res.data, " data")
  return res.data;
};