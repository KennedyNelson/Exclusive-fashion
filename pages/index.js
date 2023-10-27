import Head from "next/head";
import Banner from "../components/Banner";
import Header from "../components/Header";
import ProductFeed from "../components/ProductFeed";

export default function Home({ products }) {
  return (
    <>
      <div className="bg-gray-100 ">
        <Head>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <title>Exclusive Fashion</title>
        </Head>

        <Header />
        <main className="max-w-screen-2xl mx-auto ">
          {/* Banner */}
          <Banner />
          {/* Product Feed */}
          <ProductFeed products={products} />
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const products = await fetch("https://fakestoreapi.com/products").then(
    (res) => res.json()
  );
  return {
    props: {
      products,
    },
  };
}
