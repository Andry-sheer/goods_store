
import { API_DATA } from "../constants/constants.js";

export const FetchData = async (setData) => {
    try {
      const fetchData = await fetch(`${API_DATA}`);
      const data = await fetchData.json();
      console.log(data);
      setData(data);

    } catch (error) {
      console.log('error:', error)
    }
  }