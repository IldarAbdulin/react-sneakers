import React from 'react';
import AppContext from '../../context';
import './Info.scss';

export const Info = ({ image, title, description }) => {
  const { setCartOpened } = React.useContext(AppContext);
  return (
    <div className="cartEmpty">
      <img src={image} alt="cart" />
      <h2>{title}</h2>
      <p className="opacity-6 text-center">{description}</p>
      <button onClick={() => setCartOpened(false)} className="greenButton">
        <img src="/img/arrow_left.svg" alt="arrow" />
        Вернуться назад
      </button>
    </div>
  );
};
export default Info;
