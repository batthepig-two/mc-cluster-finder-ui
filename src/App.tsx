import { useState } from "react";
import Builder from "@/pages/Builder";
import Tutorial from "@/pages/Tutorial";

type Page = "builder" | "tutorial";

export default function App() {
  const [page, setPage] = useState<Page>("builder");

  if (page === "tutorial") {
    return <Tutorial onBack={() => setPage("builder")} />;
  }
  return <Builder onTutorial={() => setPage("tutorial")} />;
}
