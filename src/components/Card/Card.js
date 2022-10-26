import React from 'react';
import ContentLoader from "react-content-loader"
import { AppContext } from '../../App';
import moduleName from './Card.module.scss';

function Card({ id , title , imageUrl , price , onFavorite , onPlus , favorited = false , loading = false }) {

    const {isItemAdded} = React.useContext(AppContext);
    const onClickPlus = () => {
        onPlus({ id , title , imageUrl , price});
    }
    
    const [heartIsAdded , setHeartIsAdded] = React.useState(favorited);
    const onClickLike = () => {
        onFavorite({id ,title , imageUrl , price})
        setHeartIsAdded(!heartIsAdded);
    }

    return (
        <div className={moduleName.card}>
            {
                loading ?             
            <ContentLoader 
                speed={2}
                width={170}
                height={300}
                viewBox="0 0 155 265"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb">
                <rect x="0" y="15" rx="10" ry="10" width="175" height="90" /> 
                <rect x="0" y="120" rx="5" ry="5" width="150" height="19" /> 
                <rect x="0" y="149" rx="5" ry="5" width="100" height="19" /> 
                <rect x="0" y="190" rx="5" ry="5" width="80" height="24" /> 
                <rect x="119" y="185" rx="10" ry="10" width="32" height="32" />
            </ContentLoader> :
            <>
                <div className={moduleName.card__favorite}>
                    <img onClick={onClickLike} src={heartIsAdded ? "/img/heart_liked.svg" : "/img/heart_unliked.svg" } />  
                </div>
                <img width="100%" height={135} src={imageUrl} />
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
                        onClick={onClickPlus} src={isItemAdded(id) ? "/img/btn_checked.svg" : "/img/btn_plus.svg"} 
                        alt='plus' />  
                </div>
            </>
            }
        </div>
    );
}

export default Card;