import axios from "axios";

export const usePincode = async (pincode) => {
  try {
    const res = await axios.get(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    if (res.data[0].Status === "Error") {
      return {
        state: "",
        city: "",
        error: true,
      };
    } else {
      const response = {
        state: res.data[0].PostOffice[0].State,
        city: res.data[0].PostOffice[0].Block,
        error: false,
      };
      return response;
    }
  } catch (err) {
    console.log(err);
  }
};
