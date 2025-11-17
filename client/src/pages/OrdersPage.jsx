// client/src/pages/OrdersPage.jsx

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  fetchMyOrders,
  fetchAllOrders,
  updateOrderStatus,
} from '../api/order.routes';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Completed', 'Canceled'];

// helper pentru badge-uri colorate
const getStatusClasses = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Processing':
      return 'bg-blue-100 text-blue-800';
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'Canceled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All'); // <--- nou

  const user = useSelector((state) => state.user.user);
  const loggedIn = useSelector((state) => state.user.loggedIn);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!loggedIn) {
      setError('You must be logged in to see orders');
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        setLoading(true);
        let response;

        if (isAdmin) {
          response = await fetchAllOrders();
        } else {
          response = await fetchMyOrders();
        }

        if (response?.data?.success) {
          setOrders(response.data.data || []);
        } else {
          setError(response?.data?.message || 'Failed to fetch orders');
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isAdmin, loggedIn]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const { data } = await updateOrderStatus(orderId, newStatus);

      if (data?.success) {
        toast.success('Order status updated');
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
        );
      } else {
        toast.error(data?.message || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!loggedIn) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Please login to see your orders.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">
          {isAdmin
            ? 'No orders in the system yet.'
            : 'You have no orders yet.'}
        </p>
      </div>
    );
  }

  
  const filteredOrders = orders.filter((order) =>
    filterStatus === 'All' ? true : order.status === filterStatus,
  );

  return (
    <div className="bg-white h-screen overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">
            {isAdmin ? 'All Orders' : 'My Orders'}
          </h1>

          {/* FILTRU STATUS */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filter by status:</span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All</option>
              {STATUS_OPTIONS.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <p className="text-gray-600">
            No orders with status <span className="font-semibold">{filterStatus}</span>.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID:{' '}
                      <span className="font-mono text-gray-800">
                        {order.id}
                      </span>
                    </p>

                    {isAdmin && (
                      <p className="text-sm text-gray-500">
                        User:{' '}
                        <span className="font-semibold text-gray-800">
                          {order.userName || 'N/A'}
                        </span>
                        {order.userEmail && (
                          <span className="text-gray-500">
                            {' '}
                            ({order.userEmail})
                          </span>
                        )}
                      </p>
                    )}

                    <p className="text-sm text-gray-500">
                      Date:{' '}
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : '-'}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold">
                      Total: ${order.total?.toFixed(2)}
                    </p>

                    {/* Status pentru user: doar badge */}
                    {!isAdmin && (
                      <p className="mt-2 text-sm flex items-center justify-end gap-2">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusClasses(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </p>
                    )}

                    {/* Status pentru admin: badge + select pentru schimbare */}
                    {isAdmin && (
                      <div className="mt-2 flex items-center justify-end gap-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusClasses(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* items */}
                <div className="mt-4 border-t pt-3">
                  <p className="text-sm font-semibold mb-2">Items:</p>
                  <ul className="space-y-1 text-sm">
                    {order.items?.map((item) => (
                      <li
                        key={item.productId}
                        className="flex justify-between text-gray-700"
                      >
                        <span>
                          {item.name} &times; {item.quantity}
                        </span>
                        <span>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
