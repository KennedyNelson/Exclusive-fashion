import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { CgSpinner } from "react-icons/cg";
import toast from "react-hot-toast";
import { setuser } from "../store/slices/authSlice";
import {
  deleteUserFromDb,
  moveAnonymousUserDataInDb,
  updateUserInDb,
} from "../lib/firebase/db";
import {
  captchaVerifier,
  deleteAnonymousUser,
  getCredential,
  linkCredentials,
  logInWithCredential,
  logInWithPhoneNumber,
} from "../lib/firebase/auth";
import { auth } from "../lib/firebase";

export default function Modal({ open, setOpen }) {
  const cancelButtonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState({});
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userAuth);

  const handleSendCode = async () => {
    setLoading(true);
    const recaptchaVerifier = captchaVerifier();

    try {
      const verificationId = await logInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier
      );
      setVerificationId(verificationId);
      setLoading(false);
      setShowOTP(true);
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (user && user.isAnonymous) {
      const credential = getCredential(
        verificationId.verificationId,
        verificationCode
      );

      try {
        const userCred = await linkCredentials(auth.currentUser, credential);
        const user = userCred.user;
        console.log("Anonymous account successfully upgraded", user);
        setLoading(false);
        router.push("/form");

        // Update the user's phone Number in DB. This has to be done as there is an already existing doc of this user
        // without the phone number. So onAuthStateChanged will not call the setUserInDb().
        const userData = {
          id: user.uid,
          isAnonymous: user.isAnonymous,
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          photoUrl: user.photoURL,
          createdAt: new Date().toString(),
        };

        dispatch(setuser(userData));
        await updateUserInDb(user);
      } catch (error) {
        console.log("Error upgrading anonymous account", error.message);
        if (error.code == "auth/account-exists-with-different-credential") {
          try {
            const currentUser = auth.currentUser;

            // Delete the anonymous user account
            await deleteAnonymousUser(currentUser);

            // Sign in with the number that the user provided
            const result = await logInWithCredential(credential);

            router.push("/form");

            // Move old user's data to the logged in user
            await moveAnonymousUserDataInDb(
              currentUser.uid,
              result.user.uid,
              dispatch
            );

            // Delete the old user
            await deleteUserFromDb(currentUser.uid);

            console.log(
              "Anonymous account successfully merged with an existing account"
            );
            return result;
          } catch (error) {
            console.log(
              "Error merging anonymous account with an existing account",
              error.message
            );
          }
        }
        setLoading(false);
      }
    } else {
      try {
        const result = await verificationId.confirm(verificationCode);
        // Successfully logged in the anonymous user
        const user = result.user;
        console.log(user);
        setLoading(false);

        router.push("/form");
      } catch (error) {
        setLoading(false);
      }
    }
    // router.push("/form");
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="absolute z-100"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full justify-center items-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Verify your Phone Number
                    </Dialog.Title>
                    <div className="flex items-center h-10 rounded-md flex-grow cursor-pointer transition-all ">
                      <div className=" text-green-500 w-fit mx-auto p-4 rounded-full">
                        <BsTelephoneFill size={30} />
                      </div>
                      <input
                        placeholder="+919999999999"
                        className="p-2 h-full flex-grow flex-shrink rounded-l-md focus:outline-none border border-green-300 rounded-md  focus:ring-2 focus:ring-green-100  active:from-green-500 transition duration-100"
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  {showOTP ? (
                    <div className="flex flex-col items-center justify-center mt-4">
                      <Dialog.Title
                        as="h4"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Enter the OTP
                      </Dialog.Title>

                      <div className="flex justify-center items-center">
                        <div className="bg-white text-green-500 w-fit mx-auto p-4 rounded-full">
                          <BsFillShieldLockFill size={30} />
                        </div>

                        <input
                          className="p-2 h-full flex-grow flex-shrink rounded-l-md focus:outline-none border border-green-300 rounded-md  focus:ring-2 focus:ring-green-100  active:from-green-500 transition duration-100"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          //   OTPLength={6}
                          //   otpType="number"
                          //   disabled={false}
                          autoFocus
                          //   className="opt-container "
                        ></input>
                      </div>
                      <button
                        onClick={handleVerifyCode}
                        className="bg-green-500 p-4 flex gap-1 items-center justify-center py-2.5 text-white rounded flex space-x-4"
                      >
                        {loading && (
                          <CgSpinner size={20} className="mt-1 animate-spin" />
                        )}
                        <span>Verify OTP</span>
                      </button>
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-row justify-center items-center space-x-6">
                  {/* <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Deactivate
                  </button> */}
                  <button
                    id="send-code-button"
                    onClick={handleSendCode}
                    className="bg-green-500 p-6 my-6 py-2.5 text-white rounded flex space-x-4"
                  >
                    {loading && (
                      <CgSpinner size={20} className="mt-1 animate-spin" />
                    )}
                    <span>Get OTP</span>
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
