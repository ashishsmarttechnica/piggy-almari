import axios from "@/lib/axios";

export const fetchHomeScreenData = async (params = {}) => {
  const {
    latitude,
    longitude,
    page = 1,
    limit = 10,
    postLimit = 4,
  } = params;

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    postLimit: String(postLimit),
  });

  if (latitude) queryParams.append("latitude", String(latitude));
  if (longitude) queryParams.append("longitude", String(longitude));

  const res = await axios.get(`/getHomeScreenData?${queryParams.toString()}`);
  console.log(res.data, " home data");
  return res.data;
};

