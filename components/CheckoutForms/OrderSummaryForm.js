import Head from "next/head";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CheckoutProduct from "../CheckoutProduct";
import Currency from "react-currency-formatter";
import { selectItems, selectTotal } from "../../store/slices/cartSlice";

export default function OrderSummaryForm({ step, setStep }) {
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);

  const handleNext = () => {
    setStep(step + 1);
  };
  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div>
      <Head>
        <title>Order Summary</title>
      </Head>
      <h2 className="text-sm sm:text-lg font-medium mb-4">Step {step} of 3</h2>
      <div className="flex mb-4 text-sm sm:text-lg">
        <div
          className={`w-1/2 ${
            step === 1 ? "button" : "bg-gray-100"
          } p-2 text-xs sm:text-lg text-center cursor-pointer rounded-sm`}
          onClick={() => setStep(1)}
        >
          Address
        </div>
        <button
          type="submit"
          className={`w-1/2 ${
            step === 2 ? "button" : "bg-gray-100"
          } p-2 text-xs sm:text-lg text-center cursor-pointer rounded-sm`}
        >
          Order Summary
        </button>
        <div
          className={`w-1/2 ${
            step === 3 ? "button" : "bg-gray-100"
          } p-2 text-xs sm:text-lg text-center cursor-pointer rounded-sm`}
          onClick={() => setStep(3)}
        >
          Payment
        </div>
      </div>
      <div className="flex-grow shadow-sm  ">
        <div className="flex flex-col space-y-10 bg-white">
          <h1 className="text-lg sm:text-2xl border-b pb-4">
            {items.length === 0 ? "Your Cart is empty" : "Your Shopping Cart"}
          </h1>
          {items.map((item, i) => (
            <CheckoutProduct
              key={i}
              id={item.id}
              title={item.title}
              price={item.price}
              rating={item.rating}
              description={item.description}
              category={item.category}
              image={item.image}
              hasPrime={item.hasPrime}
            />
          ))}
        </div>
      </div>
      {/* Right */}
      <div className="pt-10">
        {items.length > 0 && (
          <div>
            <h2 className="whitespace-nowrap">
              Subtotal ({items.length} items):{" "}
              <span className="font-bold">
                <Currency quantity={total} currency="INR" />
              </span>
            </h2>
            <div className="flex justify-between mt-6">
              {/* <button
                className="bg-gray-300 px-6 py-1.5 rounded-lg text-gray-700 hover:bg-gray-400"
                onClick={handleBack}
              >
                Back
              </button> */}
              <button className="button w-full" onClick={handleNext}>
                Next
              </button>
            </div>
            {/* <button
              // role="link" for stripe!
              role="link"
              onClick={onCheckoutClick}
              className="button mt-2"
            >
              Continue
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
}
