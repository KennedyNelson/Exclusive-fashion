import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";
import Currency from "react-currency-formatter";
import { useDispatch, useSelector } from "react-redux";
import {
  addToBasket,
  removeFromBasket,
  selectItems,
} from "../store/slices/basketSlice";
import {
  addItemToBasket,
  removeItemFromBasket,
  useDebounce,
} from "../lib/utility/BasketFunctions";

function CheckoutProduct({
  id,
  title,
  price,
  rating,
  description,
  category,
  image,
  hasPrime,
}) {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const { user } = useSelector((state) => state.userAuth);

  const addProductToBasket = () => {
    const product = {
      id,
      title,
      price,
      rating,
      description,
      category,
      image,
      hasPrime,
    };
    dispatch(addToBasket(product));
    const newItems = addItemToBasket(items, product);
    useDebounce(user, newItems, dispatch);
  };
  const removeProductFromBasket = () => {
    dispatch(removeFromBasket({ id }));
    const newItems = removeItemFromBasket(items, id);
    useDebounce(user, newItems, dispatch);
  };
  return (
    <div className="grid grid-cols-5">
      <Image
        src={image}
        alt="product image"
        width={200}
        height={200}
        className="w-auto h-auto object-contain"
      />
      {/* Middle Section */}
      <div className="col-span-3 mx-5">
        <p>{title}</p>
        <div className="flex">
          {Array(rating)
            .fill()
            .map((i, index) => (
              <StarIcon key={index} className="h-5 text-green-500" />
            ))}
        </div>
        <p className="text-xs my-2 line-clamp-3 text-justify">{description}</p>
        <Currency quantity={price} currency="INR" />
        {hasPrime && (
          <div className="flex items-center space-x-2">
            <img
              loading="lazy"
              className="w-12"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Prime_logo.png/800px-Prime_logo.png?20180219133124"
              alt="prime"
            />
            <p className="text-xs text-gray-500">FREE Next-day Delivery</p>
          </div>
        )}
      </div>
      {/* Right buttons */}
      <div className="flex flex-col space-y-2 my-auto justify-self-end">
        <button className="button mt-auto" onClick={addProductToBasket}>
          Add to Basket{" "}
        </button>
        <button className="button mt-auto" onClick={removeProductFromBasket}>
          {" "}
          Remove from Basket{" "}
        </button>
      </div>
    </div>
  );
}

export default CheckoutProduct;
