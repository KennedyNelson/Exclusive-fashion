import Image from "next/image";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setcartitems, selectItems } from "../store/slices/cartSlice";
import appLogo from "../public/app-logo.png";
import { signOut } from "../store/slices/authSlice";
// import Modal from "./Modal";
import { useEffect, useState } from "react";
import { setcategoryproducts } from "../store/slices/productsSlice";

function Header() {
  const { user } = useSelector((state) => state.userAuth);
  const { products } = useSelector((state) => state.products);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const dispatch = useDispatch();

  const items = useSelector(selectItems);

  const handleLogout = async () => {
    dispatch(setcartitems([]));
    await dispatch(signOut());
    router.push("/");
  };

  const handleShowCategoriesClick = (category) => {
    dispatch(setcategoryproducts(category));
  };

  return (
    <header className="fixed w-screen top-0 z-50 ">
      {/* {showModal && <Modal open={showModal} setOpen={setShowModal} />} */}
      <div className="flex items-center bg-app_primary top-0 z-50  shadow-lg p-2 py-3 flex-grow">
        <div className="mt-2 flex items-center flex-grow md:flex-grow-0">
          <Image
            onClick={() => router.push("/")}
            src={appLogo}
            width={120}
            height={50}
            alt="app logo"
            priority={true}
            className="w-10 h-auto sm:w-14 mr-2 cursor-pointer"
          />
          <h1 className="text-sm sm:text-lg md:text-2xl font-bold text-black font-serif ">
            Kenny's Fashion
          </h1>
        </div>
        {/* Search */}
        <div className="hidden md:flex sm:mx-10 items-center h-10 rounded-md flex-grow cursor-pointer ml-4 bg-green-400 hover:bg-app_secondary  transition-all ">
          <input
            placeholder="Search..."
            className="p-2 h-full w-6 flex-grow flex-shrink rounded-l-md focus:outline-none"
            type="text"
          />
          <MagnifyingGlassIcon className="h-12 p-4" />
        </div>
        {/* // ! Right */}
        <div className="text-white flex items-center text-[10px] sm:text-sm space-x-2 sm:space-x-4 mx-1 sm:mx-4 whitespace-nowrap justify-end ">
          {user && !user.isAnonymous && (
            <div
              className="link "
              onClick={user && !user.isAnonymous && handleLogout}
            >
              <p>
                {/* {user && !user.isAnonymous
                ? `Hello ${
                    user.displayName
                      ? user.displayName.split(" ").slice(0, 2).join(" ")
                      : ""
                  }`
                : "Sign In"} */}
                Log Out
              </p>
              <p className="font-extrabold md:text-sm">Account & Lists</p>
            </div>
          )}
          <div onClick={() => router.push("/orders")} className="link ">
            <p>Order</p>
            <p className="font-extrabold md:text-sm">& Returns</p>
          </div>
          <div
            onClick={() => router.push("/checkout")}
            className="relative link flex items-center"
          >
            {items?.length ? (
              <span className="absolute top-0 -right-1 md:right-6 h-5 w-5 text-center text-app_theme font-bold bg-green-400 rounded-full flex items-center justify-center">
                {items?.length}
              </span>
            ) : (
              <></>
            )}
            <ShoppingCartIcon className="h-10" />
            <p className="hidden md:inline font-extrabold md:text-sm mt-1">
              Cart
            </p>
          </div>
        </div>
      </div>
      {/* Bottom Nav */}
      <div className="flex items-center space-x-3 p-2 bg-app_primary-light text-white text-xs sm:text-sm overflow-x-auto">
        <p
          className="link flex items-center"
          onClick={() => handleShowCategoriesClick("All")}
        >
          <Bars3Icon className="h-6 mr-1" />
          All
        </p>
        {Array.from(new Set(products.map((item) => item.category)))
          ?.slice(0, 5)
          .map((category) => (
            <p
              onClick={() => handleShowCategoriesClick(category)}
              className="link capitalize"
            >
              {category}
            </p>
          ))}
      </div>
    </header>
  );
}

export default Header;
