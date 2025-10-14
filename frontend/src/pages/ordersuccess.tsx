import { useSearchParams, Link } from "react-router-dom";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const ref = params.get("ref");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        🎉 Order Placed Successfully!
      </h1>
      <p className="text-lg">
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      <p className="mt-4 text-lg">
        <strong>Order Reference:</strong>{" "}
        <span className="text-blue-600">{ref}</span>
      </p>
      <p className="mt-2 text-sm text-gray-600">
        Use this reference to track your order.
      </p>

      <div className="mt-6 flex gap-4">
        <Link
          to={`/track-order?ref=${ref}`}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Track My Order
        </Link>
        <Link
          to="/"
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
