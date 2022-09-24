import React from 'react';
import moduleName from './Card.module.scss';

function Card({ id , title , imageUrl , price , onFavorite , onPlus , favorited = false }) {

    const [isAdded , setIsAdded] = React.useState(false);
    const onClickPlus = () => {
        onPlus({title , imageUrl , price});
        setIsAdded(!isAdded);
    }
    
    const [heartIsAdded , setHeartIsAdded] = React.useState(favorited);
    const onClickLike = () => {
        onFavorite({id ,title , imageUrl , price})
        setHeartIsAdded(!heartIsAdded);
    }

    return (
        <div className={moduleName.card}>
            <div className={moduleName.card__favorite}>
            <img onClick={onClickLike} src={heartIsAdded ? "/img/heart_liked.svg" : "/img/heart_unliked.svg" } />  
            </div>
            <img src={imageUrl} />
            <h5>
                {title}
            </h5>
            <div className="d-flex justify-between align-center">
            <div className="d-flex flex-column">
                <span>Цена:</span>
                <b>
                    {price} руб.
                </b>
            </div>
                <img className={moduleName.plus} 
                onClick={onClickPlus} src={isAdded ? "/img/btn_checked.svg" : "/img/btn_plus.svg"} 
                alt='plus' />
            </div>
        </div>
    );
}

export default Card;