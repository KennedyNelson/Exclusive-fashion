import React, { useEffect, useState } from "react";
import { usePincode } from "../../lib/utility/usePincode";
import { useDispatch, useSelector } from "react-redux";
import { addUserAddress } from "../../store/slices/authSlice";
import Head from "next/head";

function AddressForm({ step, setStep }) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userAuth);

  useEffect(() => {
    if (user) {
      setName(user.address.name || "");
      setPhoneNumber(user.address.phoneNumber || "");
      setBuildingName(user.address.buildingName || "");
      setArea(user.address.area || "");
      setLandmark(user.address.landmark || "");
      setPincode(user.address.pincode || "");
      setCity(user.address.city || "");
      setState(user.address.state || "");
    }
  }, [user]);

  const handleNext = async (e) => {
    e.preventDefault();
    dispatch(
      addUserAddress(user, {
        name,
        phoneNumber,
        buildingName,
        area,
        landmark,
        pincode,
        city,
        state,
      })
    );
    setStep(step + 1);
  };

  useEffect(() => {
    const getData = async () => {
      const { city, state, error } = await usePincode(pincode);
      if (!error) {
        setCity(city);
        setState(state);
      } else {
        setCity("");
        setState("");
      }
    };
    if (pincode.length === 6) {
      getData();
    } else {
      setCity("");
      setState("");
    }
  }, [pincode]);

  return (
    <>
      <Head>
        <title>Address Form</title>
      </Head>
      <form onSubmit={handleNext}>
        <h2 className="text-sm sm:text-lg font-medium mb-4">
          Step {step} of 3
        </h2>
        <div className="flex mb-4 text-sm sm:text-lg">
          <div
            className={`w-1/2 ${
              step === 1 ? "button" : "bg-gray-100"
            } p-2 text-xs sm:text-lg text-center cursor-pointer rounded-sm`}
          >
            Address
          </div>
          <button
            type="submit"
            className={`w-1/2 ${
              step === 2 ? "button" : "bg-gray-100"
            } p-2 text-xs sm:text-lg text-center cursor-pointer rounded-sm`}
            onClick={() => setStep(2)}
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
        <div className="text-sm sm:text-lg">
          <div className="mb-4">
            <label className="block mb-1 font-semibold leading-6 text-gray-900">
              Full Name
            </label>
            <input
              placeholder=""
              className="w-full p-2 h-full flex-grow flex-shrink rounded-l-md focus:outline-none border border-green-300 rounded-md  focus:ring-2 focus:ring-green-100  active:from-green-500 transition duration-100"
              type="text"
              id="name"
              name="name"
              htmlFor="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {/* <label
            className="block mb-1 font-medium mb-2 text-gray-700"
            htmlFor="name"
          >
            Full Name
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            id="name"
            name="name"
            className="w-full border border-gray-400 p-2"
          /> */}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold leading-6 text-gray-900">
              Phone Number
            </label>
            <input
              placeholder=""
              className="w-full p-2 h-full flex-grow flex-shrink rounded-l-md focus:outline-none border border-green-300 rounded-md  focus:ring-2 focus:ring-green-100  active:from-green-500 transition duration-100"
              type="text"
              id="name"
              name="phoneNumber"
              htmlFor="phoneNumber"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold leading-6 text-gray-900">
              Building Name/House No.
            </label>
            <input
              placeholder=""
              className="w-full p-2 h-full flex-grow flex-shrink rounded-l-md focus:outline-none border border-green-300 rounded-md  focus:ring-2 focus:ring-green-100  active:from-green-500 transition duration-100"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
              type="text"
              id="buildingName"
              name="buildingName"
              htmlFor="buildingName"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold leading-6 text-gray-900">
              Area, Colony
            </label>
            <input
              placeholder=""
              className="w-full p-2 h-full flex-grow flex-shrink rounded-l-md focus:outline-none border border-green-300 rounded-md  focus:ring-2 focus:ring-green-100  active:from-green-500 transition duration-100"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              type="text"
              id="area"
              name="area"
              htmlFor="area"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold leading-6 text-gray-900">
              Landmark
            </label>
            <input
              placeholder=""
              className="w-full p-2 h-full flex-grow flex-shrink rounded-l-md focus:outline-none border border-green-300 rounded-md  focus:ring-2 focus:ring-green-100  active:from-green-500 transition duration-100"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              type="text"
              id="landmark"
              name="landmark"
              htmlFor="landmark"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold leading-6 text-gray-900">
              Pincode
            </label>
            <input
              placeholder="+919999999999"
              className="w-full p-2 h-full flex-grow flex-shrink rounded-l-md focus:outline-none border border-green-300 rounded-md  focus:ring-2 focus:ring-green-100  active:from-green-500 transition duration-100"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              type="number"
              id="pincode"
              name="pincode"
              htmlFor="pincode"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold leading-6 text-gray-900">
              City
            </label>
            <input
              className="w-full p-2 h-full flex-grow flex-shrink rounded-l-md focus:outline-none border border-green-300 rounded-md  focus:ring-2 focus:ring-green-100  active:from-green-500 transition duration-100"
              required
              disabled
              value={city}
              onChange={(e) => setCity(e.target.value)}
              type="text"
              id="city"
              htmlFor="city"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold leading-6 text-gray-900">
              State
            </label>
            <input
              className="w-full p-2 h-full flex-grow flex-shrink rounded-l-md focus:outline-none border border-green-300 rounded-md  focus:ring-2 focus:ring-green-100  active:from-green-500 transition duration-100"
              required
              disabled
              value={state}
              onChange={(e) => setState(e.target.value)}
              type="text"
              id="state"
              name="state"
              htmlFor="state"
            />
          </div>
        </div>
        <div className="mt-4">
          <button type="submit" className="button w-full">
            Next
          </button>
        </div>
      </form>
    </>
  );
}

export default AddressForm;
