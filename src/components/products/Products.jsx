import React, { useContext } from 'react';
import { DataContext } from '../context/context';
import './products.scss';

export const Products = () => {
  const { filteredData } = useContext(DataContext);
  return (
    <div className='section'>
      {filteredData.map((item, index) => (
        <div key={index} className='item'>
          <span className='title'>{item.product}</span>
          {item.brand ? (
            <div className='info'>
              <span>Бренд: {item.brand}</span>
              <span>Стоимость: {item.price}</span>
            </div>
          ) : (
            <div>
              <span>Стоимость: {item.price}</span>
            </div>
          )}

          <span>{item.id}</span>
        </div>
      ))}
    </div>
  );
};
