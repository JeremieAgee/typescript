// Import Dotenv
require("dotenv").config();

const axios = require("axios");

export const supabaseDB = axios.create({
  baseURL: process.env.SUPABASE_URL + "/rest/v1",
  timeout: 1500,
  headers: {
    apikey: process.env.SUPABASE_KEY,
    Authorization: "Bearer " + process.env.SUPABASE_KEY,
  },
});
