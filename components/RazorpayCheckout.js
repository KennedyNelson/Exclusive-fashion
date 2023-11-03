import axios from "axios";

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

export const makePayment = async (user, total) => {
  let res = await initializeRazorpay();
  if (!res) {
    alert("Razorpay SDK Failed to load");
    return;
  }

  // Make API call to the serverless API
  res = await axios.post("/api/razorpay", {
    method: "POST",
    total: Math.floor(total),
  });

  var options = {
    key: "rzp_test_onB6cFsdmtVCp3", // Enter the Key ID generated from the Dashboard
    name: "Kenny's Fashion Pvt Ltd",
    currency: res.data.currency,
    amount: res.data.amount,
    email: user?.email || null,
    order_id: res.data.id,
    description: "Thankyou for your test donation",
    handler: function (response) {
      // Validate payment at server - using webhooks is a better idea.
      // alert(response.razorpay_payment_id);
      // alert(response.razorpay_order_id);
      // alert(response.razorpay_signature);
    },
    prefill: {
      name: user?.displayName || "",
      email: user?.email || "",
      contact: user?.phoneNumber || "",
    },
    notes: {
      userId: user?.id || "",
    },
  };
  var rzp = new Razorpay(options);
  rzp.on("payment.failed", function (response) {
    alert(response.error.code);
    alert(response.error.description);
    alert(response.error.reason);
  });

  rzp.open();
};
