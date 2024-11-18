import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useDebouncedValue } from '@/app/hooks/useDebouncedValue';
import eventEmitter from '@/utilities/emitters/EventEmitter';
import close from '../../../../public/assets/images/icons/close-one.svg'
import magnifyingGlass from '../../../../public/assets/images/icons/magnifying-glass.svg';
import './SearchBar.css'


const SearchBar = (): JSX.Element => {
  const [searchText, setSearchText] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  };

  const clearSearch = () => {
    setSearchText('');
  };

  const debouncedSearchTerm = useDebouncedValue(searchText, 500);

  const imageProps = useMemo(() => ({
      className: `search-bar__icon ${!searchText ? '' : 'close-sign'}`,
      src: !searchText ? magnifyingGlass : close,
      onClick: !searchText ? () => void (0) : () => clearSearch()
  }), [searchText]);

  useEffect(() => {
    //@ts-ignore
    eventEmitter.emit('sendSearchText', searchText); 
    return () => {
      eventEmitter.unsubscribe('sendSearchText');
    };
  },[searchText])

  return (
    <>
      <div className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            className="search-bar__input"
            value={searchText}
            onChange={handleChange}
          />
          {<Image alt="" {...imageProps} />}
        </div>
      </div>
    </>
  );
};

export default SearchBar;
