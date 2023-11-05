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
      {/* <div className="mb-4">
        <label
          className="block font-medium mb-2 text-gray-700"
          htmlFor="password"
        >
          Username
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="w-full border border-gray-400 p-2"
        />
      </div> */}
      <h2 className="text-lg font-medium mb-4">Step {step} of 3</h2>
      <div className="flex mb-4">
        <div
          className={`w-1/2 ${
            step === 1 ? "bg-blue-500 text-white" : "bg-gray-200"
          } p-2 text-center cursor-pointer`}
          onClick={() => setStep(1)}
        >
          Address
        </div>
        <div
          className={`w-1/2 border-r border-gray-400 ${
            step === 2 ? "bg-blue-500 text-white" : "bg-gray-200"
          } p-2 text-center cursor-pointer`}
        >
          Order Summary
        </div>
        <div
          className={`w-1/2 border-r border-gray-400 ${
            step === 3 ? "bg-blue-500 text-white" : "bg-gray-200"
          } p-2 text-center cursor-pointer`}
          onClick={() => setStep(3)}
        >
          Payment
        </div>
      </div>
      <div className="flex-grow m-5 shadow-sm  ">
        <div className="flex flex-col p-5 space-y-10 bg-white">
          <h1 className="text-3xl border-b pb-4">
            {items.length === 0
              ? "Your Amazon Cart is empty"
              : "Your Shopping Cart"}
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
      <div className="flex flex-col bg-white p-10 shadow-md min-w-[400px]">
        {items.length > 0 && (
          <div>
            <h2 className="whitespace-nowrap">
              Subtotal ({items.length} items):{" "}
              <span className="font-bold">
                <Currency quantity={total} currency="INR" />
              </span>
            </h2>
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-300 px-6 py-1.5 rounded-lg text-gray-700 hover:bg-gray-400"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className="bg-blue-500 px-6 py-1.5 rounded-lg text-white hover:bg-blue-600"
                onClick={handleNext}
              >
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
