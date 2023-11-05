import axios from "axios";
import { setCartItems } from "../../store/slices/cartSlice";

const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(true);
    };

    document.body.appendChild(script);
  });
};

export const makePayment = async (user, items, total, router, dispatch) => {
  let res = await initializeRazorpay();
  if (!res) {
    alert("Razorpay SDK Failed to load");
    return;
  }

  // Make API call to the serverless API
  res = await axios.post("/api/razorpay", {
    method: "POST",
    total: Math.floor(total),
    user,
    items,
  });

  console.log(res.data);
  var options = {
    key: "rzp_test_onB6cFsdmtVCp3", // Enter the Key ID generated from the Dashboard
    name: "Kenny's Fashion Pvt Ltd",
    currency: res.data.currency,
    amount: res.data.amount,
    order_id: res.data.id,
    email: user?.email || null,
    description: "Thank you for choosing Kenny's Fashion",
    handler: function (response) {
      console.log(response);
      dispatch(setCartItems(user.id, []));
      router.push("/orders");
      // Validate payment at server - using webhooks is a better idea.
      // alert(response.razorpay_payment_id);
      // alert(response.razorpay_order_id);
      // alert(response.razorpay_signature);
    },
    prefill: {
      name: user?.displayName || null,
      email: user?.email || null,
      contact: user?.phoneNumber || null,
    },
    // notes: {
    //   userId: user?.id || null,
    //   images: JSON.stringify(items.map((item) => item.image)),
    //   name: user?.displayName || null,
    // },
  };
  var rzp = new Razorpay(options);
  rzp.on("payment.failed", function (response) {
    alert(response.error.code);
    alert(response.error.description);
    alert(response.error.reason);
  });

  rzp.open();
};
