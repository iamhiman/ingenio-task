import { ADVISORS_API, ADVISORS_ONLINE_STATUS_API } from "./constants";

export const fetchData = async id => {
  const API_URL = id ? `${ADVISORS_ONLINE_STATUS_API}${id}` : ADVISORS_API;
  const apiType = id ? "Advisors_online_status_API" : "Advisors_API";

  try {
    const response = await fetch(API_URL);
    const apiData = await response.json();
    return apiData;
  } catch (error) {
    console.error("Error fetching data in " + apiType + " : " + error);
    return null;
  }
};
