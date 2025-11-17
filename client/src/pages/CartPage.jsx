// client/src/pages/CartPage.jsx

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { changeQty, removeItem, clearCart } from '../store/slices/cartSlice';
import { createOrder } from '../api/order.routes';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((state) => state.cart.items || []);
  const user = useSelector((state) => state.user.user);
  const loggedIn = useSelector((state) => state.user.loggedIn);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!loggedIn) {
      toast.error('You need to be logged in to place an order');
      navigate('/login');
      return;
    }

    try {
      // pregătim payload-ul: { productId, quantity }
      const payloadItems = items.map((it) => ({
        productId: it.id,
        quantity: it.quantity,
      }));

      const { data } = await createOrder(payloadItems);

      if (data?.success) {
        toast.success('Order created successfully');

        // golim cart-ul
        dispatch(clearCart());

        // navigăm la pagina de succes, trimitem order-ul prin state
        navigate('/checkout/success', { state: { order: data.data } });
      } else {
        toast.error(data?.message || 'Failed to create order');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error while creating order');
    }
  };

  if (items.length === 0) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
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
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.id} className="py-4 flex gap-4 items-center">
              <img
                src={item.image || 'https://via.placeholder.com/80'}
                alt={item.name}
                className="w-20 h-20 rounded object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">${item.price}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() =>
                      dispatch(
                        changeQty({
                          id: item.id,
                          quantity: item.quantity - 1,
                        }),
                      )
                    }
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() =>
                      dispatch(
                        changeQty({
                          id: item.id,
                          quantity: item.quantity + 1,
                        }),
                      )
                    }
                  >
                    +
                  </button>
                  <button
                    className="ml-4 text-red-600"
                    onClick={() => dispatch(removeItem(item.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>

        {/* bara de jos cu total + butoane, inclusiv Checkout în dreapta */}
        <div className="mt-6 flex items-center justify-between">
          <button
            className="text-sm text-gray-600 underline"
            onClick={() => dispatch(clearCart())}
          >
            Clear cart
          </button>
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold">
              Total: ${total.toFixed(2)}
            </div>
            <button
              onClick={handleCheckout}
              className="rounded-md bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Checkout
            </button>
          </div>
        </div>

        {user && (
          <p className="mt-2 text-xs text-gray-500 text-right">
            Order will be placed on account: <span className="font-medium">{user.email}</span>
          </p>
        )}
      </div>
    </div>
  );
}
