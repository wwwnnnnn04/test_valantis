import CryptoJS from 'crypto-js';
import { useEffect, useContext, useState } from 'react';
import { DataContext } from '../context/context';

const timestamp = new Date().toISOString().slice(0, 10).split('-').join('');
const data = process.env.REACT_APP_API_KEY + '_' + timestamp;

const authorizationString = CryptoJS.MD5(data).toString();

function removeDuplicatesKeepFirst(arr) {
  return arr.filter(
    (item, index) => arr.indexOf(item) === index && item !== null
  );
}
let filterItems = { result: [] };

const fetchDataFilter = async (
  setCount,
  setListBrand,
  currentBrand,
  setFilterData,
  setData,
  setLoading,
  currentProduct,
  setCurrentBrand,
  setCurrentProduct,
  currentPrice,
  setCurrentPrice,
  setPaginateFilter
) => {
  setLoading(true);
  try {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth': authorizationString,
      },
    };

    const brandList = await fetch(process.env.REACT_APP_API, {
      ...fetchOptions,
      body: JSON.stringify({
        action: 'get_fields',
        params: { field: 'brand', offset: 0 },
      }),
    });
    const brandJSON = await brandList.json();
    const brand = removeDuplicatesKeepFirst(brandJSON.result);
    setListBrand(brand);

    if (currentBrand.length !== 0) {
      const filterBrand = await fetch(process.env.REACT_APP_API, {
        ...fetchOptions,
        body: JSON.stringify({
          action: 'filter',
          params: { brand: currentBrand },
        }),
      });
      const filteredBrand = await filterBrand.json();
      filterItems = filteredBrand;
      setCurrentBrand([]);
    } else if (currentProduct.length !== 0) {
      const filterProduct = await fetch(process.env.REACT_APP_API, {
        ...fetchOptions,
        body: JSON.stringify({
          action: 'filter',
          params: { product: currentProduct },
        }),
      });
      const filteredProduct = await filterProduct.json();
      filterItems = filteredProduct;
      setCurrentProduct([]);
    } else if (currentPrice.length !== 0) {
      const filterPrice = await fetch(process.env.REACT_APP_API, {
        ...fetchOptions,
        body: JSON.stringify({
          action: 'filter',
          params: { price: currentPrice },
        }),
      });
      const filteredPrice = await filterPrice.json();
      filterItems = filteredPrice;
      setCurrentPrice([]);
    }
    if (filterItems && filterItems.result && filterItems.result.length !== 0) {
      const filterRes = await fetch(process.env.REACT_APP_API, {
        ...fetchOptions,
        body: JSON.stringify({
          action: 'get_items',
          params: {
            ids: filterItems.result,
          },
        }),
      });
      const res = await filterRes.json();
      setCount(filterItems.result.length);

      setPaginateFilter(res.result);
    }
    if (!brandList.ok) {
      throw new Error('Failed to fetch data');
    }
    setLoading(false);
  } catch (error) {
    console.error('Error fetching data:', error);
    if (error.message !== 'Failed to fetch data') {
      fetchDataFilter(
        setCount,
        setListBrand,
        currentBrand,
        setFilterData,
        setData,
        setLoading,
        currentProduct,
        setCurrentBrand,
        setCurrentProduct,
        currentPrice,
        setCurrentPrice,
        setPaginateFilter
      );
    }
    setLoading(false);
  }
};

export const GetFilter = () => {
  const {
    setData,
    setCount,
    setLoading,
    setListBrand,
    currentBrand,
    setFilterData,
    currentProduct,
    setCurrentBrand,
    setCurrentProduct,
    currentPrice,
    setCurrentPrice,
    setPaginateFilter,
  } = useContext(DataContext);

  useEffect(() => {
    fetchDataFilter(
      setCount,
      setListBrand,
      currentBrand,
      setFilterData,
      setData,
      setLoading,
      currentProduct,
      setCurrentBrand,
      setCurrentProduct,
      currentPrice,
      setCurrentPrice,
      setPaginateFilter
    ).catch((error) => console.error('Error fetching data:', error));
  }, [
    setCount,
    setListBrand,
    currentBrand,
    setFilterData,
    setData,
    setLoading,
    currentProduct,
    setCurrentBrand,
    setCurrentProduct,
    currentPrice,
    setCurrentPrice,
    setPaginateFilter,
  ]);

  return null;
};
