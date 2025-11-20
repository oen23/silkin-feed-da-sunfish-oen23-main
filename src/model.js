import axios from 'axios';

export async function feedFish() {
  try {
    const port = process.env.PORT || 5500;
    const response = await axios.post(`http://127.0.0.1:${port}/feed`);
    return {
      status: response.status,
      ok: response.status >= 200 && response.status < 300,
      body: response.data
    };
  } catch (error) {
    if (error.response) {
      return {
        status: error.response.status,
        ok: false,
        body: error.response.data
      };
    }
    throw error;
  }
}