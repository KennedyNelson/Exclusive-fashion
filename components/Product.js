import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import Currency from "react-currency-formatter";
import { useDispatch, useSelector } from "react-redux";
import { addtocart } from "../store/slices/cartSlice";
import { addItemToCart, useDebounce } from "../lib/utility/CartFunctions";

function Product({ id, title, price, description, category, image }) {
  const dispatch = useDispatch();
  const MAX_RATING = 5;
  const MIN_RATING = 1;
  const [rating, setRating] = useState(0);
  const [hasPrime, setIsPrimeEnabled] = useState(0);

  const { user } = useSelector((state) => state.userAuth);
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    setRating(
      Math.floor(Math.random() * (MAX_RATING - MIN_RATING + 1)) + MIN_RATING
    );
    setIsPrimeEnabled(Math.random() < 0.5);
  }, []);

  const addProductToCart = async () => {
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
    dispatch(addtocart(product));
    const newItems = addItemToCart(items, product);
    useDebounce(user, newItems, dispatch);
  };

  return (
    <div className="relative flex flex-col m-2 md:m-5 bg-white z-30 p-5 md:p-8 space-y-2">
      <p className="absolute top-2 right-2 text-gray-400 text-xs">{category}</p>
      <Image
        src={image}
        height={150}
        width={100}
        className="w-fit h-fit object-contain m-auto "
        alt="product image"
      />
      <p className="text-xs sm:text-sm md:text-md">{title}</p>
      <div className="flex">
        {Array(rating)
          .fill()
          .map((i, index) => (
            <StarIcon key={index} className="h-5 text-green-500" />
          ))}
      </div>
      <p className="text-xs line-clamp-2">{description}</p>
      <div className="text-sm md:text-md">
        <Currency quantity={price} currency="INR" />
      </div>
      {hasPrime ? (
        <div className=" flex items-center space-x-2 ">
          <img
            loading="lazy"
            className="w-8 sm:w-12"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Prime_logo.png/800px-Prime_logo.png?20180219133124"
            alt="prime"
          />
          <p className="text-[10px] sm:text-xs text-gray-500">
            FREE Next-day Delivery
          </p>
        </div>
      ) : null}
      <div className="flex-grow" />
      <button onClick={addProductToCart} className="button">
        Add to Cart
      </button>
    </div>
  );
}

export default Product;
