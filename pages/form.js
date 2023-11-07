import { useState } from "react";
import AddressForm from "../components/CheckoutForms/AddressForm";
import OrderSummaryForm from "../components/CheckoutForms/OrderSummaryForm";
import PaymentForm from "../components/CheckoutForms/PaymentForm";
import Header from "../components/Header";
const MultiStepForm = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex justify-center bg-gray-100  mt-28">
        <div className="bg-white p-6 rounded-lg shadow-md w-full lg:max-w-xl my-6">
          {step === 1 && <AddressForm step={step} setStep={setStep} />}
          {step === 2 && <OrderSummaryForm step={step} setStep={setStep} />}
          {step === 3 && <PaymentForm step={step} setStep={setStep} />}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
