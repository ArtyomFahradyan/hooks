import { useEffect, useState } from "react";

export function useBreakpoint() {
  const width = window.innerWidth;
  const [xs, setXs] = useState(true);
  const [sm, setSm] = useState(true);
  const [md, setMd] = useState(true);
  const [lg, setLg] = useState(true);
  const [xl, setXl] = useState(true);
  const [xxl, setXxl] = useState(true);

  useEffect(() => {
    setXxl(width >= 1600);
    setXl(width >= 1200);
    setLg(width >= 992);
    setMd(width >= 768);
    setSm(width >= 576);
    setXs(width < 576);
  }, [width]);

  return { xs, sm, md, lg, xl, xxl };
}
