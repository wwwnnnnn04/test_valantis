import './app.scss';
import { GetStore } from './components/getStore/GetStore';
import { DataContext } from './components/context/context';
import { useState } from 'react';
import { Pagination } from './components/pagination/Pagination';
import { Header } from './components/header/Header';
import { GetFilter } from './components/getFilter/GetFilter';
import ProductsList from './components/productsList/PeoductsList';

function App() {
  const [data, setData] = useState();
  const [limit] = useState(50);
  const [offset, setOffset] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState();
  const [loading, setLoading] = useState(false);
  const [listBrand, setListBrand] = useState([]);
  const [currentBrand, setCurrentBrand] = useState([]);
  const [currentProduct, setCurrentProduct] = useState([]);
  const [currentPrice, setCurrentPrice] = useState([]);
  const [paginateFilter, setPaginateFilter] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [reset, setReset] = useState(0);

  const paginate = (pageNum) => setCurrentPage(pageNum);
  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        limit,
        offset,
        setOffset,
        count,
        setCount,
        loading,
        setLoading,
        listBrand,
        setListBrand,
        currentBrand,
        setCurrentBrand,
        currentProduct,
        setCurrentProduct,
        currentPrice,
        setCurrentPrice,
        paginateFilter,
        setPaginateFilter,
        filteredData,
        setFilteredData,
        currentPage,
        setCurrentPage,
        reset,
        setReset,
      }}
    >
      <div className='app'>
        <Header />
        <GetStore />
        <GetFilter />
        <Pagination paginate={paginate} />
        <ProductsList />
      </div>
    </DataContext.Provider>
  );
}

export default App;
