import { useAuth } from "../hooks/useAuth";
import AdminChat from "./AdminChat";

const ProtectedAdminChat = () => {
  const { user } = useAuth();
  const isAdmin = user?.email === "admin@studyabroad.com"; // Hardcoded for now

  return isAdmin ? (
    <AdminChat />
  ) : (
    <div className="py-10 text-center">Access Denied</div>
  );
};

export default ProtectedAdminChat;