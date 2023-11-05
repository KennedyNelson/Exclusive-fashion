import React, { useEffect, useState } from "react";
import { usePincode } from "../../lib/utility/usePincode";
import { useDispatch, useSelector } from "react-redux";
import { addUserAddress } from "../../store/slices/authSlice";

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
        <h2 className="text-lg font-medium mb-4">Step {step} of 3</h2>
        <div className="flex mb-4">
          <div
            className={`w-1/2 ${
              step === 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            } p-2 text-center cursor-pointer`}
          >
            Address
          </div>
          <button
            type="submit"
            className={`w-1/2 border-r border-gray-400 ${
              step === 2 ? "bg-blue-500 text-white" : "bg-gray-200"
            } p-2 text-center cursor-pointer`}
          >
            Order Summary
          </button>
          <div
            className={`w-1/2 border-r border-gray-400 ${
              step === 3 ? "bg-blue-500 text-white" : "bg-gray-200"
            } p-2 text-center cursor-pointer`}
            onClick={() => setStep(3)}
          >
            Payment
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block font-medium mb-2 text-gray-700"
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
          />
        </div>
        <div className="mb-4">
          <label
            className="block font-medium mb-2 text-gray-700"
            htmlFor="phoneNumber"
          >
            Phone Number
          </label>
          <input
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            type="number"
            id="number"
            name="phoneNumber"
            className="w-full border border-gray-400 p-2"
          />
        </div>
        <div className="mb-4">
          <label
            className="block font-medium mb-2 text-gray-700"
            htmlFor="buildingName"
          >
            Building Name/House No.
          </label>
          <input
            required
            value={buildingName}
            onChange={(e) => setBuildingName(e.target.value)}
            type="text"
            id="buildingName"
            name="buildingName"
            className="w-full border border-gray-400 p-2"
          />
        </div>
        <div className="mb-4">
          <label
            className="block font-medium mb-2 text-gray-700"
            htmlFor="area"
          >
            Area, Colony
          </label>
          <input
            required
            value={area}
            onChange={(e) => setArea(e.target.value)}
            type="text"
            id="area"
            name="area"
            className="w-full border border-gray-400 p-2"
          />
        </div>
        <div className="mb-4">
          <label
            className="block font-medium mb-2 text-gray-700"
            htmlFor="landmark"
          >
            Landmark
          </label>
          <input
            required
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            type="text"
            id="landmark"
            name="landmark"
            className="w-full border border-gray-400 p-2"
          />
        </div>
        <div className="mb-4">
          <label
            className="block font-medium mb-2 text-gray-700"
            htmlFor="pincode"
          >
            Pincode
          </label>
          <input
            required
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            type="number"
            id="pincode"
            name="pincode"
            className="w-full border border-gray-400 p-2"
          />
        </div>
        <div className="mb-4">
          <label
            className="block font-medium mb-2 text-gray-700"
            htmlFor="pincode"
          >
            City
          </label>
          <input
            required
            disabled
            value={city}
            onChange={(e) => setCity(e.target.value)}
            type="text"
            id="city"
            name="city"
            className="w-full border border-gray-400 p-2"
          />
        </div>
        <div className="mb-4">
          <label
            className="block font-medium mb-2 text-gray-700"
            htmlFor="pincode"
          >
            State
          </label>
          <input
            required
            disabled
            value={state}
            onChange={(e) => setState(e.target.value)}
            type="text"
            id="state"
            name="state"
            className="w-full border border-gray-400 p-2"
          />
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="bg-blue-500 px-6 py-1.5 rounded-lg text-white hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      </form>
    </>
  );
}

export default AddressForm;
