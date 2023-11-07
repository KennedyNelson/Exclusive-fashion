import Image from "next/image";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import { selectItems, selectTotal } from "../store/slices/cartSlice";
import CheckoutProduct from "../components/CheckoutProduct";
import Head from "next/head";
import Currency from "react-currency-formatter";
import banner from "../public/prime_banner.jpg";
import axios from "axios";
import { useState } from "react";
import Modal from "../components/Modal";
import { useRouter } from "next/router";

function Checkout() {
  const [showModal, setShowModal] = useState(false);

  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const { user } = useSelector((state) => state.userAuth);
  const router = useRouter();

  const onCheckoutClick = () => {
    if (user && !user.isAnonymous) {
      router.push("/form");
    } else if (user && user.isAnonymous) {
      setShowModal(true);
    }
  };

  return (
    <div className="bg-gray-100 ">
      {showModal && <Modal open={showModal} setOpen={setShowModal} />}
      <Head>
        <title>Checkout Page</title>
      </Head>
      <Header />
      <main className="lg:flex max-w-screen-2xl mx-auto mt-28">
        {/* Left */}
        <div className="flex-grow m-5 shadow-sm  ">
          <Image
            src={banner}
            width={1050}
            height={250}
            alt="shopping banner"
            priority={true}
            className="w-auto h-auto object-contain "
          />

          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">
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
        <div className="flex flex-col bg-white p-10 shadow-md min-w-[400px]">
          {items.length > 0 && (
            <div className="flex flex-col bg-white p-10 shadow-md">
              <h2 className="whitespace-nowrap">
                Subtotal ({items.length} items):{" "}
                <span className="font-bold">
                  <Currency quantity={total} currency="INR" />
                </span>
              </h2>
              <button
                // role="link" for stripe!
                role="link"
                onClick={onCheckoutClick}
                className="button mt-2"
              >
                Proceed to checkout
              </button>

              <p className="text-xs mt-2">
                By clicking "Proceed to checkout", you agree to Kenny's
                Conditions of Use and Privacy Notice.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Checkout;
