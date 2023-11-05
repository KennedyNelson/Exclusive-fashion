import Header from "../components/Header";
import Head from "next/head";
import moment from "moment";
import { db } from "../lib/firebase/";
import { doc, getDocs, collection } from "firebase/firestore";
import Order from "../components/Order";
import { useSelector } from "react-redux";
import nookies from "nookies";

function Orders({ orders }) {
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
          {user && !user.isAnonymous ? (
            <h2>{user.email}</h2>
          ) : (
            <h2>Please sign in to see your orders</h2>
          )}

          <h2>{orders?.length} Orders</h2>

          <div className="mt-5 space-y-4">
            {/* {orders?.map(
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
            )} */}
            {orders?.map(({ id, amount, items, images }) => (
              <Order
                key={id}
                id={id}
                amount={amount}
                items={items}
                images={images}
              />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default Orders;

export async function getServerSideProps(ctx) {
  // Get the user logged in credentials/clearance
  // it is a promise, so we need to await it

  const { firebaseAdmin } = require("../lib/firebase/firebaseAdmin");
  const cookies = nookies.get(ctx);

  if (!cookies.token) {
    return {
      props: {},
    };
  }
  const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
  // console.log(token);

  if (!token) {
    return {
      props: {},
    };
  }

  const docRef = collection(db, "users", token.uid, "orders");
  const razorpayOrders = await getDocs(docRef);
  const orders = razorpayOrders.docs.map((order) => ({
    id: order.id,
    amount: order.data().amount,
    items: order.data().items,
    images: order.data().items.map((item) => item.image),
    // amountShipping: order.data().amount_shipping,
    // images: order.data().notes.images,
    // timestamp: moment(order.data().timestamp.toDate()).unix(),
    // timestamp: moment.unix(order.data().created_at),
    // items: (
    //   await stripe.checkout.sessions.listLineItems(order.id, {
    //     limit: 100,
    //   })
    // ).data,
  }));

  return {
    props: {
      orders,
    },
  };
}
