import { Navigate, redirect } from "react-router";

export function meta() {
  return [
    { title: "Opposer - Playground" }
  ];
}

export default function Dashboard() {
    return <Navigate to="/handlers" />
}