import { useContext, useState } from 'react';
import { DataContext } from '../context/context';
import './header.scss';
import Select from 'react-select';

export const Header = () => {
  const {
    listBrand,
    loading,
    currentBrand,
    setCurrentBrand,
    setCurrentProduct,
    setCurrentPrice,
    setCurrentPage,
    setOffset,
    setPaginateFilter,
    setReset,
  } = useContext(DataContext);
  const [nameValue, setNameValue] = useState('');
  const [priceValue, setPriceValue] = useState('');
  const [brandValue, setBrandValue] = useState('');

  const options = [
    {
      value: '',
      label: 'Все',
    },
    ...listBrand.map((item) => {
      return {
        value: item,
        label: item,
      };
    }),
  ];

  const getNameValue = () => {
    setBrandValue(
      currentBrand ? options.find((b) => b.value === currentBrand) : ''
    );
  };

  const handleNameInputChange = (e) => {
    setNameValue(e.target.value);
  };

  const handlePriceInputChange = (e) => {
    setPriceValue(e.target.value);
  };

  const handleNameButtonClick = () => {
    setCurrentProduct(nameValue);
    setCurrentPage(1);
  };

  const handlePriceButtonClick = () => {
    setCurrentPrice(Number(priceValue));
    setCurrentPage(1);
  };

  const handleSelectChange = (newValue) => {
    setCurrentBrand(newValue.value);
    getNameValue();
    setCurrentPage(1);
  };
  const reset = () => {
    setReset(1);
    setOffset(0);
    setCurrentBrand([{}]);
    setCurrentProduct('');
    setCurrentPrice('');
    setPaginateFilter([]);
    setPriceValue('');
    setNameValue('');
    setBrandValue('');
  };

  return (
    <div className='header'>
      <div className='search'>
        <input
          type='text'
          value={nameValue}
          onChange={handleNameInputChange}
          placeholder='Поиск по названию'
        />
        <button onClick={handleNameButtonClick}>Поиск</button>
      </div>

      <div className='search'>
        <input
          type='text'
          value={priceValue}
          onChange={handlePriceInputChange}
          placeholder='Поиск по цене'
        />
        <button onClick={handlePriceButtonClick}>Поиск</button>
      </div>

      <Select
        options={options}
        value={brandValue}
        onChange={handleSelectChange}
        placeholder='Бренд...'
        isLoading={loading}
        className='select'
      />
      <button onClick={reset} className='reset'>
        Сбросить
      </button>
    </div>
  );
};
