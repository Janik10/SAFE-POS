import { Navigate } from "react-router-dom";

interface Props {
  element: JSX.Element;
  allowedRoles: string[];
}

export default function ProtectedRoute({ element, allowedRoles }: Props) {
  const role = localStorage.getItem("role");
  if (!role || !allowedRoles.includes(role)) {
    alert("Доступ запрещен");
    return <Navigate to="/" replace />;
  }
  return element;
}
