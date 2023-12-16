import { useContext } from "react";
import { SessionContext } from "../contexts/session";

export function useSession() {
  return useContext(SessionContext);
}
