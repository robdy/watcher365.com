"use client"
import { useEffect } from "react";

const Plausible = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.setAttribute("data-domain", window.location.host);
    script.async = true;
		script.defer = true;
    script.src = "https://plausible.io/js/plausible.js";
    document.head.appendChild(script);
  }, []);

  return null;
};

export default Plausible;
