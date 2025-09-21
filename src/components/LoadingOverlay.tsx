import "../LoadingOverlay.css";

type Props = { show: boolean; progress?: number };

function LoadingOverlay({ show, progress = 0 }: Props) {
  if (!show) return null;
  return (
    <div
      className="content"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.9)",
        zIndex: 9999,
      }}
    >
      <div className="pokedex">
        <div className="top">
          <div className="camera"></div>
          <div className="lights">
            <div className="red"></div>
            <div className="yellow"></div>
            <div className="green"></div>
          </div>
        </div>
        <div className="rect"></div>
        <div className="space">
          <div className="arrow-behind"></div>
          <div className="arrow"></div>
        </div>
        <div className="scroll">
          <div className="bar">
            <div className="square-top"></div>
            <div className="square-bottom"></div>
          </div>
        </div>
        <div className="fill"></div>
        <div className="triangle"></div>
        <div className="inverse"></div>
        <div className="end">
          <div className="strip"></div>
        </div>
      </div>
      <div className="shadow"></div>
      <div className="loader">
        <div
          className="progress"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

export default LoadingOverlay;
