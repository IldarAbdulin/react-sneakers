import React from 'react';
import { Routes , Route , Link } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header/Header';
import Drawer from './components/Drawer/Drawer';
import Card from './components/Card/Card';


function App() {

  const [cartOpened , setCartOpened] = React.useState(false);
  const [cartItems , setCartItems] = React.useState([]);
  const [favorites , setFavorites] = React.useState([]);
  const [searchValue , setSearchValue] = React.useState('');
  const [items , setItems] = React.useState([]);

  React.useEffect(() => {
    axios.get('https://632c3c545568d3cad88073b3.mockapi.io/items').then((res) => {
      setItems(res.data)
    });
    axios.get('https://632c3c545568d3cad88073b3.mockapi.io/cart').then((res) => {
      setCartItems(res.data)
    });
    axios.get('https://632c3c545568d3cad88073b3.mockapi.io/favorites').then((res) => {
      setFavorites(res.data)
    });

  } , []);

  const onAddToCart = (obj) => {
    axios.post('https://632c3c545568d3cad88073b3.mockapi.io/cart' , obj);
    setCartItems(prev =>[...prev , obj])
  }

  const onRemoveItem = (id) => {
    axios.delete(`https://632c3c545568d3cad88073b3.mockapi.io/cart/${id}`);
    setCartItems((prev) => prev.filter((item) => item.id != id));
  }

  const onAddFavorite = async (obj) => {
    try {
      if(favorites.find(favObj => favObj.id === obj.id)) {
        axios.delete(`https://632c3c545568d3cad88073b3.mockapi.io/favorites/${obj.id}`);
      } else {
        const {data} = await axios.post('https://632c3c545568d3cad88073b3.mockapi.io/favorites' , obj);
        setFavorites(prev =>[...prev , data])
      }
    } catch (error) {
      alert('Не удалось добавть в фавориты')
    }
  }

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value)
  }

  return (
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
              items.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()))
              .map((item , index) => (
                <Card 
                key={index}
                title = {item.title} 
                price = {item.price} 
                imageUrl = {item.imageUrl} 
                onFavorite = {(obj) => onAddFavorite(obj)}
                onPlus = {(obj) => onAddToCart(obj)}
                />
              ))
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
                onFavorite = {onAddFavorite}
                />
              ))
            }

              </div>
            </div>

        </section>
        } />

      </Routes>
  


    </div>
  );
}

export default App;