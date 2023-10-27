import Header from "../components/Header";
import Head from "next/head";
import moment from "moment";
import db from "../lib/firebase/";
import { doc, getDocs, collection } from "firebase/firestore";
import Order from "../components/Order";
import { useSelector } from "react-redux";
function Orders({ orders }) {
  // console.log(orders);
  const { user } = useSelector((state) => state.userAuth);

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen mt-28">
        <Head>
          <title>Orders</title>
        </Head>
        <main className="max-w-screen-lg mx-auto p-10">
          <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
            Your Orders
          </h1>
          {user ? (
            <h2>{user.email}</h2>
          ) : (
            <h2>Please sign in to see your orders</h2>
          )}

          <h2>{orders?.length} Orders</h2>

          <div className="mt-5 space-y-4">
            {orders?.map(
              ({ id, amount, amountShipping, items, timestamp, images }) => (
                <Order
                  key={id}
                  id={id}
                  amount={amount}
                  amountShipping={amountShipping}
                  items={items}
                  timestamp={timestamp}
                  images={images}
                />
              )
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default Orders;

// export async function getServerSideProps(context) {
//   const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//   // Get the user logged in credentials/clearance
//   // it is a promise, so we need to await it

//   const session = await getSession(context);
//   if (!session) {
//     return {
//       props: {},
//     };
//   }
//   const docRef = collection(db, "users", session.user.email, "orders");
//   const stripeOrders = await getDocs(docRef);
//   const orders = await Promise.all(
//     stripeOrders.docs.map(async (order) => ({
//       id: order.id,
//       amount: order.data().amount,
//       amountShipping: order.data().amount_shipping,
//       images: order.data().images,
//       timestamp: moment(order.data().timestamp.toDate()).unix(),
//       items: (
//         await stripe.checkout.sessions.listLineItems(order.id, {
//           limit: 100,
//         })
//       ).data,
//     }))
//   );

//   return {
//     props: {
//       orders,
//     },
//   };
// }
