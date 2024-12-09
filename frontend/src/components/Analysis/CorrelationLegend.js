
const CorrelationLegend = ({ darkMode }) => {
  const dynamicBlue = darkMode ? "#498df3" : "#024ebf";
  const dynamicRed = darkMode ? "#f74d4d" : "#ad0000";
  const dynamicNeutral = darkMode ? "#261a25" : "#ede1ec";

  const legendItems = [
    { color: dynamicBlue, label: "strong +ve correlation", strokeWidth: 8 },
    { color: dynamicRed, label: "strong -ve correlation", strokeWidth: 8 },
    { color: dynamicNeutral, label: "uncorrelated", strokeWidth: 2 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "10px" }}>
      {legendItems.map((item, index) => (
        <div key={index} style={{ marginBottom: "10px", textAlign: "center" }}>
          {/* Line */}
          <svg width="50" height="10">
            <line
              x1="0"
              y1="5"
              x2="50"
              y2="5"
              stroke={item.color}
              strokeWidth={item.strokeWidth}
            />
          </svg>
          {/* Label */}
          <div
            style={{
              color: darkMode ? '#dce0e3' : '#222324',
              fontSize: "18px",
              marginTop: "4px",
            }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CorrelationLegend;
