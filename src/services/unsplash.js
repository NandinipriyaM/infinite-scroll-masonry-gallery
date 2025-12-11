import axios from "axios";

const API_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

export const unsplash = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: `Client-ID ${API_KEY}`,
  },
});
