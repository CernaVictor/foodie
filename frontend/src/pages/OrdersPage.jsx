import { DeliveryGuyView } from "../components/DriverOrdersView";
import { RestaurantView } from "../components/RestaurantOrdersView";
import { UserView } from "../components/UserOrdersView";
import { useAuth } from "../context/LoginContext";

export function OrdersPage() {
  const { user } = useAuth();
  return (
    <>
      {user && user.role === "driver" && <DeliveryGuyView />}
      {user && user.role === "admin" && <RestaurantView />}
      {user && user.role === "user" && <UserView />}
    </>
  );
}
