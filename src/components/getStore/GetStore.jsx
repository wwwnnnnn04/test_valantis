import CryptoJS from 'crypto-js';
import { useEffect, useContext } from 'react';
import { DataContext } from '../context/context';

const timestamp = new Date().toISOString().slice(0, 10).split('-').join('');
const data = process.env.REACT_APP_API_KEY + '_' + timestamp;

const authorizationString = CryptoJS.MD5(data).toString();

function removeDuplicatesById(arr) {
  const uniqueIds = new Set();
  return arr.filter((obj) => {
    if (!uniqueIds.has(obj.id)) {
      uniqueIds.add(obj.id);
      return true;
    }
    return false;
  });
}

const fetchData = async (offset, limit, setCount, setData, setLoading) => {
  setLoading(true);
  try {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth': authorizationString,
      },
    };

    const countProduct = await fetch(process.env.REACT_APP_API, {
      ...fetchOptions,
      body: JSON.stringify({
        action: 'get_ids',
      }),
    });

    const countData = await countProduct.json();
    setCount(countData.result.length);
    const idResponse = await fetch(process.env.REACT_APP_API, {
      ...fetchOptions,
      body: JSON.stringify({
        action: 'get_ids',
        params: { offset: offset, limit: limit },
      }),
    });

    const idData = await idResponse.json();

    const dataResponse = await fetch(process.env.REACT_APP_API, {
      ...fetchOptions,
      body: JSON.stringify({
        action: 'get_items',
        params: {
          ids: idData.result,
        },
      }),
    });

    const dataProduct = await dataResponse.json();
    const uniqueObjects = removeDuplicatesById(dataProduct.result);
    setData(uniqueObjects);

    if (uniqueObjects.length < limit) {
      const additionalItems = await fetch(process.env.REACT_APP_API, {
        ...fetchOptions,
        body: JSON.stringify({
          action: 'get_items',
          params: {
            ids: idData.result.slice(uniqueObjects.length, limit),
          },
        }),
      });

      const additionalData = await additionalItems.json();
      uniqueObjects.push(...additionalData.result);
    }

    if (!countProduct.ok || !dataResponse.ok || !idResponse.ok) {
      throw new Error('Failed to fetch data');
    }
    setLoading(false);
  } catch (error) {
    console.error('Error fetching data:', error);
    if (error.message !== 'Failed to fetch data') {
      fetchData(offset, limit, setCount, setData, setLoading);
    }
    setLoading(false);
  }
};

export const GetStore = () => {
  const { setData, limit, offset, setCount, setLoading, reset } =
    useContext(DataContext);

  useEffect(() => {
    fetchData(offset, limit, setCount, setData, setLoading).catch((error) =>
      console.error('Error fetching data:', error)
    );
  }, [limit, offset, setCount, setData, setLoading, reset]);

  return null;
};
