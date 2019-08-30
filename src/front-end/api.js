/* eslint-disable no-cond-assign */
import axios from 'axios';

export const getTradDetails = async (stockId) => {
  const { data } = await axios({
    method: 'get',
    url: `/api/stock/trade-details/${stockId}`,
  });
  data.reverse();
  return data;
};

export const getTickInfo = async (stockId) => {
  const { data } = await axios({
    method: 'get',
    url: `/api/stock/tick/${stockId}`,
  });
  return data;
};
