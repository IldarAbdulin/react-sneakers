import React from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/pages/Header';
import Drawer from './components/Drawer/Drawer';
import Card from './components/Card/Card';
import AppContext from './context';
import Orders from './components/pages/Orders';

function App() {
  const [cartOpened, setCartOpened] = React.useState(false);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      async function fetchData() {
        const [itemsResponse, cartResponse, favoritesResponse] =
          await Promise.all([
            axios.get('https://632c3c545568d3cad88073b3.mockapi.io/items'),
            axios.get('https://632c3c545568d3cad88073b3.mockapi.io/cart'),
            axios.get('https://632c3c545568d3cad88073b3.mockapi.io/favorites'),
          ]);

        setIsLoading(false);

        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setItems(itemsResponse.data);
      }
      fetchData();
    } catch (error) {
      alert('Ошибка при загрузке данных');
    }
  }, []);

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find(
        (item) => Number(item.parentId) === Number(obj.id)
      );
      if (findItem) {
        await axios.delete(
          `https://632c3c545568d3cad88073b3.mockapi.io/cart/${findItem.id}`
        );
        setCartItems((prev) =>
          prev.filter((item) => Number(item.parentId) !== Number(obj.id))
        );
      } else {
        setCartItems((prev) => [...prev, obj]);
        const { data } = await axios.post(
          'https://632c3c545568d3cad88073b3.mockapi.io/cart',
          obj
        );
        setCartItems((prev) =>
          prev.map((item) => {
            if (item.parentId === data.parentId) {
              return {
                ...item,
                id: data.id,
              };
            }
            return item;
          })
        );
      }
    } catch (error) {
      alert('Ошибка при добавлении в корзину');
    }
  };

  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://632c3c545568d3cad88073b3.mockapi.io/cart/${id}`);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert('Ошибка при удалении из корзины');
    }
  };

  const onAddFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
        axios.delete(
          `https://632c3c545568d3cad88073b3.mockapi.io/favorites/${obj.id}`
        );
        setFavorites((prev) =>
          prev.filter((item) => Number(item.id) !== Number(obj.id))
        );
      } else {
        const { data } = await axios.post(
          'https://632c3c545568d3cad88073b3.mockapi.io/favorites',
          obj
        );
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты');
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  };

  const renderItems = () => {
    const filtredItems = items.filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    return (isLoading ? [...Array(8)] : filtredItems).map((item, index) => (
      <Card
        key={index}
        onFavorite={(obj) => onAddFavorite(obj)}
        onPlus={(obj) => onAddToCart(obj)}
        loading={isLoading}
        {...item}
      />
    ));
  };

  return (
    <AppContext.Provider
      value={{
        cartItems,
        favorites,
        items,
        onAddToCart,
        isItemAdded,
        onAddFavorite,
        setCartOpened,
        setCartItems,
      }}
    >
      <div className="wrapper clear">
        <Drawer
          items={cartItems}
          onClose={() => setCartOpened(false)}
          onRemove={onRemoveItem}
          opened={cartOpened}
        />

        <Header onClickCart={() => setCartOpened(true)} />

        <Routes>
          <Route
            path="/"
            element={
              <section>
                <div className="content p-40">
                  <div className="d-flex align-center justify-between mb-40">
                    <h1>
                      {searchValue
                        ? `Поиск по запросу: '${searchValue}'`
                        : `Все кроссовки`}
                    </h1>
                    <div className="search-block d-flex">
                      <img src="/img/search.svg" alt="Search" />
                      {searchValue && (
                        <img
                          onClick={() => setSearchValue('')}
                          className="clear cu-p"
                          src="/img/btn_remove.svg"
                          alt="remove"
                        />
                      )}
                      <input
                        onChange={onChangeSearchInput}
                        value={searchValue}
                        placeholder="Поиск..."
                      />
                    </div>
                  </div>

                  <div className="d-flex flex-wrap">{renderItems()}</div>
                </div>
              </section>
            }
          />

          <Route
            path="favorites"
            element={
              <section>
                <div className="content p-40">
                  <div className="d-flex align-center justify-between mb-40">
                    <h1>Мои закладки</h1>
                  </div>

                  <div className="d-flex flex-wrap">
                    {favorites.map((item, index) => (
                      <Card
                        key={index}
                        id={item.id}
                        title={item.title}
                        price={item.price}
                        imageUrl={item.imageUrl}
                        favorited={true}
                        onFavorite={onAddFavorite}
                      />
                    ))}
                  </div>
                </div>
              </section>
            }
          />
          <Route path="orders" element={<Orders />} />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
