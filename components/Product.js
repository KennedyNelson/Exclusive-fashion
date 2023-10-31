import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import Currency from "react-currency-formatter";
import { useDispatch, useSelector } from "react-redux";
import { addToBasket } from "../store/slices/basketSlice";
import { signInAnonymous } from "../store/slices/authSlice";
import { debounce } from "lodash";
import { setBasketItems } from "../store/slices/basketSlice";

const callDebounce = debounce(async (user, items, dispatch) => {
  if (!user) {
    const result = await dispatch(signInAnonymous());
    setTimeout(async () => {
      await dispatch(setBasketItems(result.user.uid, items));
    }, 1500);
  } else {
    await dispatch(setBasketItems(user.id, items));
  }
}, 1000);

function Product({ id, title, price, description, category, image }) {
  const dispatch = useDispatch();
  const MAX_RATING = 5;
  const MIN_RATING = 1;
  const [rating, setRating] = useState(0);
  const [hasPrime, setIsPrimeEnabled] = useState(0);

  const { user } = useSelector((state) => state.userAuth);
  const { items } = useSelector((state) => state.basket);

  useEffect(() => {
    setRating(
      Math.floor(Math.random() * (MAX_RATING - MIN_RATING + 1)) + MIN_RATING
    );
    setIsPrimeEnabled(Math.random() < 0.5);
  }, []);

  const addItemToBasket = async () => {
    const product = {
      id,
      title,
      price,
      description,
      category,
      image,
      rating,
      hasPrime,
    };
    // sending products infos to redux store
    dispatch(addToBasket(product));
    const newItems = [...items, product];
    callDebounce(user, newItems, dispatch);
  };

  return (
    <div className="relative flex flex-col m-5 bg-white z-30 p-10 ">
      <p className="absolute top-2 right-2 text-gray-400 ">{category}</p>

      <Image
        src={image}
        height={150}
        width={100}
        className="w-fit h-fit object-contain m-auto "
        alt="product image"
      />
      <h4>{title}</h4>
      <div className="flex">
        {Array(rating)
          .fill()
          .map((i, index) => (
            <StarIcon key={index} className="h-5 text-yellow-500" />
          ))}
      </div>
      <p className="text-xs my-2 line-clamp-2">{description}</p>
      <div className="mb-5">
        <p>Rs {price}</p>
        {/* <Currency quantity={price} currency="GBP" /> */}
      </div>
      {hasPrime ? (
        <div className=" flex items-center space-x-2 -mt-5">
          <img
            loading="lazy"
            className="w-12"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Prime_logo.png/800px-Prime_logo.png?20180219133124"
            alt="prime"
          />
          <p className="text-xs text-gray-500">FREE Next-day Delivery</p>
        </div>
      ) : null}
      <button onClick={addItemToBasket} className="mt-auto button ">
        Add to Basket
      </button>
    </div>
  );
}

export default Product;
