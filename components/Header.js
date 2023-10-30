import Image from "next/image";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectItems } from "../store/slices/basketSlice";
import amazonLogo from "../public/amazon_logo.png";
import { signinWithGoogle, signOut } from "../store/slices/authSlice";

function Header() {
  const { user } = useSelector((state) => state.userAuth);
  const router = useRouter();

  const dispatch = useDispatch();

  const login = async () => {
    router.push("/phone-login");
  };
  const handleLogout = async () => {
    await dispatch(signOut());
    router.push("/");
  };

  const items = useSelector(selectItems);
  return (
    <header className="fixed w-screen top-0 z-50 ">
      <div className="flex items-center bg-amazon_blue top-0 z-50  shadow-lg p-2 py-3 flex-grow">
        <div className="mt-2 flex items-center flex-grow sm:flex-grow-0">
          <Image
            onClick={() => router.push("/")}
            src={amazonLogo}
            width={120}
            height={50}
            alt="amazon logo"
            priority={true}
            className="w-auto h-auto cursor-pointer"
          />
        </div>
        {/* Search */}
        <div className="hidden sm:flex items-center h-10 rounded-md flex-grow cursor-pointer bg-yellow-400 hover:bg-yellow-500 ml-2 transition-all ">
          <input
            className="p-2 h-full w-6 flex-grow flex-shrink rounded-l-md focus:outline-none"
            type="text"
          />
          <MagnifyingGlassIcon className="h-12 p-4" />
        </div>
        {/* // ! Right */}
        <div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap ">
          <div className="link " onClick={!user ? login : handleLogout}>
            <p>
              {user
                ? `Hello ${
                    user?.displayName
                      ? user.displayName.split(" ").slice(0, 2).join(" ")
                      : ""
                  }`
                : "Sign In"}
            </p>
            <p className="font-extrabold md:text-sm">Account & Lists</p>
          </div>
          <div onClick={() => router.push("/orders")} className="link ">
            <p>Returns</p>
            <p className="font-extrabold md:text-sm">& Orders</p>
          </div>
          <div
            onClick={() => router.push("/checkout")}
            className="relative link flex items-center"
          >
            <span className="absolute top-0 -right-1 md:right-6 h-4 w-4 text-center text-amazon_blue font-bold bg-yellow-400 rounded-full">
              {items?.length}
            </span>
            <ShoppingCartIcon className="h-10" />
            <p className="hidden md:inline font-extrabold md:text-sm mt-1">
              Cart
            </p>
          </div>
        </div>
      </div>
      {/* Bottom Nav */}
      <div className="flex items-center space-x-3 p-2 bg-amazon_blue-light text-white ">
        <p className="link flex items-center">
          <Bars3Icon className="h-6 mr-1" />
          All
        </p>
        <p className="link">Prime Video</p>
        <p className="link">Amazon Business</p>
        <p className="link">Today's Deals</p>
        <p className="link hidden lg:inline-flex">Electronics</p>
        <p className="link hidden lg:inline-flex">Food & Grocery</p>
        <p className="link hidden lg:inline-flex">Prime</p>
        <p className="link hidden lg:inline-flex">Buy Again</p>
        <p className="link hidden lg:inline-flex">Shopping Toolkit</p>
        {/* <p className="link hidden lg:inline-flex">Health & Personal Care</p> */}
      </div>
    </header>
  );
}

export default Header;
