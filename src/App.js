import React from 'react';
import { Routes , Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header/Header';
import Drawer from './components/Drawer/Drawer';
import Card from './components/Card/Card';
export const AppContext = React.createContext({});

function App() {
  const [cartOpened , setCartOpened] = React.useState(false);
  const [cartItems , setCartItems] = React.useState([]);
  const [favorites , setFavorites] = React.useState([]);
  const [searchValue , setSearchValue] = React.useState('');
  const [items , setItems] = React.useState([]);
  const [isLoading , setIsLoading] = React.useState(true);

  React.useEffect(() => {

    async function fetchData() {
      const itemsResponse = await axios.get('https://632c3c545568d3cad88073b3.mockapi.io/items');
      const cartResponse = await axios.get('https://632c3c545568d3cad88073b3.mockapi.io/cart');
      const favoritesResponse = await axios.get('https://632c3c545568d3cad88073b3.mockapi.io/favorites');

      setIsLoading(false)

      setCartItems(cartResponse.data);
      setFavorites(favoritesResponse.data);
      setItems(itemsResponse.data);
    }
    fetchData()
  } , []);

  const onAddToCart = (obj) => {
    console.log(obj)
    if(cartItems.find((item) => Number(item.id) === Number(obj.id))) {
        axios.delete(`https://632c3c545568d3cad88073b3.mockapi.io/cart/${obj.id}`);
        setCartItems(prev => prev.filter(item => Number(item.id) !== Number(obj.id)));
    }else {
        axios.post('https://632c3c545568d3cad88073b3.mockapi.io/cart' , obj);
        setCartItems((prev) => [...prev , obj]);
    }
  };

  const onRemoveItem = (id) => {
    axios.delete(`https://632c3c545568d3cad88073b3.mockapi.io/cart/${id}`);
    setCartItems((prev) => prev.filter((item) => item.id != id));
  }

  const onAddFavorite = async (obj) => {
    try {
      if(favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
        axios.delete(`https://632c3c545568d3cad88073b3.mockapi.io/favorites/${obj.id}`);
        setFavorites(prev => prev.filter(item => Number(item.id) !== Number(obj.id)));
      } else {
        const {data} = await axios.post('https://632c3c545568d3cad88073b3.mockapi.io/favorites' , obj);
        setFavorites(prev =>[...prev , data])
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты')
    }
  }

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value)
  }

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.id) === Number(id));
  }

  const renderItems = () => {
    const filtredItems = items.filter((item) => 
      item.title.toLowerCase().includes(searchValue.toLowerCase()),
    );
    return ( isLoading ? [...Array(8)] : filtredItems).map((item , index) => (
    <Card 
    key={index}
    onFavorite = {(obj) => onAddFavorite(obj)}
    onPlus = {(obj) => onAddToCart(obj)}
    loading = {isLoading}
    {...item}
    />
    ))
  };

  return (
    <AppContext.Provider value={{cartItems , favorites , items , isItemAdded , onAddFavorite , setCartOpened , setCartItems}}>
      <div className="wrapper clear">

        {cartOpened && <Drawer items={cartItems}  onClose = {() => setCartOpened(false)} onRemove={onRemoveItem} />}
      
        <Header
          onClickCart= {() => setCartOpened(true)}
        />

      <Routes>
        <Route path='/' element = { 
          <section>
            <div className='content p-40'>
              <div className="d-flex align-center justify-between mb-40">
                <h1>{searchValue ? `Поиск по запросу: '${searchValue}'` : `Все кроссовки`}</h1>
                  <div className="search-block d-flex">
                    <img src="/img/search.svg" alt="Search" />
                    { searchValue && <img onClick={() => setSearchValue('')} className='clear cu-p' src="/img/btn_remove.svg" alt="remove" /> }
                    <input onChange={onChangeSearchInput} value={searchValue} placeholder="Поиск..." />
                  </div>
              </div>
          
              <div className="d-flex flex-wrap">
                {
                  renderItems()
                }
              </div>
            </div>
          </section>}/>

          <Route path='/favorites' element = {
                  <section>
                  <div className='content p-40'>
                    <div className="d-flex align-center justify-between mb-40">
                      <h1>Мои закладки</h1>
                    </div>
              
                    <div className="d-flex flex-wrap">
                  {
                      favorites.map((item , index) => (
                      <Card 
                      key={index}
                      id = {item.id}
                      title = {item.title} 
                      price = {item.price} 
                      imageUrl = {item.imageUrl} 
                      favorited = {true}
                      onFavorite={onAddFavorite}
                      />
                    ))
                  }
                    </div>
                  </div>
                </section>
          } />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;