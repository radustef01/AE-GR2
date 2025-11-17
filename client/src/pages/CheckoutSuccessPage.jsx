// client/src/pages/CheckoutSuccessPage.jsx

import { useLocation, useNavigate } from 'react-router-dom';

export default function CheckoutSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    // dacă vii direct pe /checkout/success fără state
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-gray-600">
            No order data. Please place an order first.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
          >
            Go to products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white h-screen overflow-y-auto">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">Felicitări!</h1>
        <p className="mb-6">
          Ai comandat cu succes produsele de mai jos. ID comandă:{' '}
          <span className="font-mono">{order.id}</span>
        </p>

        <ul className="divide-y">
          {order.items.map((item) => (
            <li key={item.productId} className="py-3 flex justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Cantitate: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${item.price}</p>
                <p className="text-sm text-gray-500">
                  Total:{' '}
                  {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => navigate('/products')}
            className="rounded-md border px-4 py-2 text-sm font-medium"
          >
            Înapoi la produse
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Vezi comenzile mele
          </button>
        </div>
      </div>
    </div>
  );
}
