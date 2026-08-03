import "../styles/Loading.css";

function Loading() {
  return (
    <div className="care24-loading-screen" aria-live="polite" aria-busy="true">
      <div className="care24-loading-shell">
        <div className="care24-loading-orb" aria-hidden="true" />
        <div className="care24-loading-logo" aria-hidden="true">
          <i className="fas fa-heart-pulse" />
        </div>
      </div>
    </div>
  );
}

export default Loading;
