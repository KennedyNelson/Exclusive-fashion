import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectItems, selectTotal } from "../../store/slices/cartSlice";
import Currency from "react-currency-formatter";
import Modal from "../Modal";
import { makePayment } from "../../lib/razorpay/razorpayCheckout";
import { useRouter } from "next/router";
import Head from "next/head";

function PaymentForm({ step, setStep }) {
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const { user } = useSelector((state) => state.userAuth);

  const [selectedOption, setSelectedOption] = useState("prepaid");

  const router = useRouter();
  const dispatch = useDispatch();

  const handleNext = () => {
    if (selectedOption === "prepaid") {
      makePayment(user, items, total, router, dispatch);
    }
  };
  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <>
      <Head>
        <title>Payment Form</title>
      </Head>
      <h2 className="text-sm sm:text-lg font-medium mb-4">Step {step} of 3</h2>
      <div className="flex mb-4 text-sm sm:text-lg">
        <div
          className={`w-1/2 ${
            step === 1 ? "button" : "bg-gray-200"
          } p-2 text-xs sm:text-lg text-center cursor-pointer rounded-sm`}
          onClick={() => setStep(1)}
        >
          Address
        </div>
        <button
          type="submit"
          className={`w-1/2 ${
            step === 2 ? "button" : "bg-gray-200"
          } p-2 text-xs sm:text-lg text-center cursor-pointer rounded-sm`}
          onClick={() => setStep(2)}
        >
          Order Summary
        </button>
        <div
          className={`w-1/2 ${
            step === 3 ? "button" : "bg-gray-200"
          } p-2 text-xs sm:text-lg text-center cursor-pointer rounded-sm`}
        >
          Payment
        </div>
      </div>
      <div className="flex flex-col bg-white p-10 shadow-md mb-4">
        {items.length > 0 && (
          <div>
            <h2 className="whitespace-nowrap">
              Total ({items.length} items):{" "}
              <span className="font-bold">
                <Currency quantity={total} currency="INR" />
              </span>
            </h2>
          </div>
        )}
      </div>
      <div className="mb-4 flex justify-between">
        <label className="block font-medium mb-2 text-gray-700">
          Prepaid(Online)
        </label>
        <input
          type="radio"
          value="prepaid"
          checked={selectedOption === "prepaid"}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="form-radio h-4 w-4 text-indigo-600"
        />
      </div>
      <div className="mb-4 flex justify-between">
        <label className="block font-medium mb-2 text-gray-700">COD</label>
        <input
          type="radio"
          value="cod"
          checked={selectedOption === "cod"}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="form-radio h-4 w-4 text-indigo-600"
        />
      </div>
      <div className="flex justify-between mt-6">
        {/* <button
          className="bg-gray-300 px-6 py-1.5 rounded-lg text-gray-700 hover:bg-gray-400"
          onClick={handleBack}
        >
          Back
        </button> */}
        <button className="button w-full" onClick={handleNext}>
          Place Order
        </button>
      </div>
    </>
  );
}

export default PaymentForm;
