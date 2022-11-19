import React, { useEffect } from "react";

export default () => {
  const [s, setS] = useState();

  useEffect(() => {});

  return (
    <div className="layout">
      <div className="site-layout-content" style={{ margin: "100px auto" }}>
        <h1>Title</h1>
      </div>
      <footer style={{ textAlign: "center" }}>foot..</footer>
    </div>
  );
};
