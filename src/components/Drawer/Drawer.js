import drawerStyle from './Drawer.module.scss';

function Drawer({ onClose , onRemove ,  items = [] }) {
    return(
        <div className={drawerStyle.overlay}>
            <div className={drawerStyle.drawer}>
                <h2 className="d-flex justify-between mb-30">
                Корзина    
                <img className={drawerStyle.cartItemREmove} onClick = {onClose} src="/img/btn_remove.svg" alt="remove" /> 
                </h2>

                {
                    items.length > 0 ?    
                    <div className={drawerStyle.drawerParent}>
                        <div className={drawerStyle.items}>
                            {
                                items.map((obj) => (
                                <div className={drawerStyle.cartItem}>
                                    <img className="mr-20" width={70} height={70} src={obj.imageUrl} />
                                    <div className="mr-20">
                                        <p className="mb-5">{obj.title}</p>
                                        <b>{obj.price} руб.</b>
                                     </div>
                                    <img onClick={() => onRemove(obj.id)} className={drawerStyle.cartItemREmove} src="/img/btn_remove.svg" alt="remove" />
                                </div>
                                ))
                            }
                        </div>

                        <div className={drawerStyle.cartTotalBlock}>
                            <ul>
                                <li>
                                    <span>Итого:</span>
                                    <div></div>
                                    <b>21 498 руб.</b>
                                </li>
                                <li>
                                    <span>Налог 5%:</span>
                                    <div></div>
                                    <b>1074 руб.</b>
                                </li>
                            </ul>
                                <button className={drawerStyle.secondGreenButton}>
                                    Оформить заказ<img src="/img/arrow.svg" alt="arrow" /> 
                                </button>
                        </div>

                    </div>
                    :
                       <div className={drawerStyle.cartEmpty}>
                            <img  src="/img/empty_cart.svg" />
                            <h2>Корзина пустая</h2>
                            <p className='opacity-6 text-center'>Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ.</p>
                            <button onClick={onClose} className={drawerStyle.greenButton}>
                                <img src="/img/arrow_left.svg" alt='arrow' />Вернуться назад
                            </button>
                        </div>
                } 

            </div>
      </div>
    );
}

export default Drawer;