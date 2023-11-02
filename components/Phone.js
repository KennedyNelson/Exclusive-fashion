import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";

// import OtpInput from "otp-input-react";
import { useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  RecaptchaVerifier,
  linkWithCredential,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  deleteUser,
  signInWithCredential,
} from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import { moveAnonymousUserData } from "../lib/firebase/db";

const Phone = () => {
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState({});
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userAuth);

  const handleSendCode = () => {
    setLoading(true);
    const recaptchaVerifier = new RecaptchaVerifier(
      "send-code-button",
      {
        size: "invisible",
      },
      auth
    );

    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      .then((verificationId) => {
        console.log(verificationId);
        setVerificationId(verificationId);
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const handleVerifyCode = async () => {
    if (user && user.isAnonymous) {
      var credential = PhoneAuthProvider.credential(
        verificationId.verificationId,
        verificationCode
      );
      try {
        const userCred = await linkWithCredential(auth.currentUser, credential);
        const user = userCred.user;
        console.log("Anonymous account successfully upgraded", user);
        setLoading(false);
        router.push("/");

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

        dispatch(setUser(userData));
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, {
          phoneNumber: user.phoneNumber,
          isAnonymous: false,
        });
      } catch (error) {
        console.log("Error upgrading anonymous account", error.message);
        if (error.code == "auth/account-exists-with-different-credential") {
          try {
            // const userCred = await auth.currentUser.linkWithCredential(e.credential);
            // var user = userCred.user;
            // var currentUserId = auth.currentUser.uid;
            const currentUser = auth.currentUser;
            await deleteUser(currentUser);
            const result = await signInWithCredential(auth, credential);
            await moveAnonymousUserData(
              currentUser.uid,
              result.user.uid,
              dispatch
            );
            router.push("/");
            // await updateParticularResumeFromDb('resumes', 'userId', currentUserId, result.user.uid);

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
        const user = result.user;
        console.log(user);
        setLoading(false);

        router.push("/");
      } catch (error) {
        setLoading(false);
      }
    }
    // router.push("/");
  };

  return (
    <section className="bg-emerald-500 flex items-center justify-center h-screen">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user && !user.isAnonymous ? (
          <h2 className="text-center text-white font-medium text-2xl">
            👍Login Success
          </h2>
        ) : (
          <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
            <h1 className="text-center leading-normal text-white font-medium text-3xl mb-6">
              Welcome to <br /> CODE A PROGRAM
            </h1>
            {showOTP ? (
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  <BsFillShieldLockFill size={30} />
                </div>
                <label
                  htmlFor="otp"
                  className="font-bold text-xl text-white text-center"
                >
                  Enter your OTP
                </label>
                <input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  //   OTPLength={6}
                  //   otpType="number"
                  //   disabled={false}
                  autoFocus
                  //   className="opt-container "
                ></input>
                <button
                  onClick={handleVerifyCode}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  <BsTelephoneFill size={30} />
                </div>
                <label
                  htmlFor=""
                  className="font-bold text-xl text-white text-center"
                >
                  Verify your phone number
                </label>
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <button
                  id="send-code-button"
                  onClick={handleSendCode}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Send code via SMS</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Phone;
