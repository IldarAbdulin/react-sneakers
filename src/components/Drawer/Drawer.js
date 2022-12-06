import React from 'react';
import drawerStyle from './Drawer.module.scss';
import axios from 'axios';
import Info from '../Card/Info';
import { useCart } from '../../hooks/useCart';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Drawer({ onClose, onRemove, items = [], opened }) {
  const {cartItems, setCartItems, totalPrice} = useCart()
  const { orderId, setOrderId } = React.useState(null);
  const [isOrderComplete, setIsOrderComplete] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onClickOrder = async () => {
    try {
      setIsLoading(true);

      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        await axios.delete(
          'https://632c3c545568d3cad88073b3.mockapi.io/cart/' + item.id
        );
        await delay(1000);
      }

      const { data } = await axios.post(
        'https://632c3c545568d3cad88073b3.mockapi.io/orders',
        {
          items: cartItems,
        }
      );

      setOrderId(data.id);
      setIsOrderComplete(true);
      setCartItems([]);
    } catch (error) {
      alert('Ошибка при создании заказа :(');
    }
    setIsLoading(false);
  };

  return (
    <div className={`${drawerStyle.overlay} ${opened ? drawerStyle.overlayVisible : ''}`}>
      <div className={drawerStyle.drawer}>
        <h2 className="d-flex justify-between mb-30">
          Корзина
          <img
            className={drawerStyle.cartItemREmove}
            onClick={onClose}
            src="/img/btn_remove.svg"
            alt="remove"
          />
        </h2>

        {items.length > 0 ? (
          <>
            <div className='items'>
              {items.map((obj) => (
                <div key={obj.id} className='cartItem'>
                  <img
                    className="mr-20"
                    width={70}
                    height={70}
                    src={obj.imageUrl}
                    alt='sneaker'
                  />
                  <div className="mr-20">
                    <p className="mb-5">{obj.title}</p>
                    <b>{obj.price} руб.</b>
                  </div>
                  <img
                    onClick={() => onRemove(obj.id)}
                    className='cartItemRemove'
                    src="/img/btn_remove.svg"
                    alt="remove"
                  />
                </div>
              ))}
            </div>

            <div className='cartTotalBlock'>
              <ul>
                <li>
                  <span>Итого:</span>
                  <div></div>
                  <b>{totalPrice} руб.</b>
                </li>
                <li>
                  <span>Налог 5%:</span>
                  <div></div>
                  <b>{totalPrice} руб.</b>
                </li>
              </ul>
              <button
                onClick={onClickOrder}
                disabled={isLoading}
                className='secondGreenButton'
              >
                Оформить заказ
                <img src="/img/arrow.svg" alt="arrow" />
              </button>
            </div>
          </>
        ) : (
          <Info
            title={isOrderComplete ? 'Заказ оформлен' : 'Корзина пустая'}
            description={
              isOrderComplete
                ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке`
                : 'Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ.'
            }
            image={
              isOrderComplete
                ? '/img/complete_order.svg'
                : '/img/empty_cart.svg'
            }
          />
        )}
      </div>
    </div>
  );
}

export default Drawer;
