import axios from 'axios';

const baseUrl = './src/webtool/weaves/';

export async function importWeaves() {
  const response = await axios.get(baseUrl + 'plainWeave.json');
  return response.data;
}
