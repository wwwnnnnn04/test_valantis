import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../context/context';
import './pagination.scss';

export const Pagination = ({ paginate }) => {
  const {
    count,
    limit,
    setOffset,
    setLoading,
    paginateFilter,
    currentPage,
    data,
    setFilteredData,
  } = useContext(DataContext);

  const handlePageClick = (pageNumber) => {
    setLoading(true);
    paginate(pageNumber);
    setOffset((pageNumber - 1) * limit);
  };
  let [num, setNum] = useState(1);
  let [cur, setCur] = useState(1);
  useEffect(() => {
    if (data && data.length > 0) {
      if (paginateFilter.length !== 0) {
        const lastProductIndex = currentPage * limit;
        const firstProductIndex = lastProductIndex - limit;
        const displayedProducts = paginateFilter.slice(
          firstProductIndex,
          lastProductIndex
        );
        setNum(1);
        setFilteredData(displayedProducts);
      } else {
        setFilteredData(data.slice(0, limit));
      }
    }
  }, [data, paginateFilter, currentPage, limit]);

  let pages = [];
  if (Math.ceil(count / limit) === 1) {
    pages = [{ page: num }];
  } else if (Math.ceil(count / limit) === 2) {
    pages = [{ page: num }, { page: num + 1 }];
  } else {
    pages = [{ page: num }, { page: num + 1 }, { page: num + 2 }];
  }

  function Next() {
    num + 2 < Math.ceil(count / limit) && setNum(++num);
    console.log(num, Math.ceil(count / limit), count);
  }
  function back() {
    num > 1 && setNum(--num);
  }

  return (
    <div className='box'>
      <div className='container'>
        <button onClick={back}>Назад</button>
        {pages.map((pg, i) => (
          <>
            {paginateFilter.length !== 0 ? (
              <button
                key={i}
                onClick={() => {
                  setCur(pg.page);
                  paginate(pg.page);
                }}
              >
                {pg.page}
              </button>
            ) : (
              <button
                key={i}
                onClick={() => {
                  setCur(pg.page);
                  handlePageClick(pg.page);
                }}
              >
                {pg.page}
              </button>
            )}
          </>
        ))}
        <button onClick={Next}>Вперед</button>
      </div>
    </div>
  );
};
