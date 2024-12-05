import CorrelationDiagram from "../components/Correlation/CorrelationDiagram";
import { mainContainer } from "../utils/tailwindClasses";

const mockMatrix = [
  [ 0.00,  0.35, -0.20,  0.80, -0.10],
  [ 0.35,  0.00,  0.60, -0.45,  0.00],
  [-0.20,  0.60,  0.00,  0.25,  0.55],
  [ 0.80, -0.45,  0.25,  0.00, -0.30],
  [-0.10,  0.00,  0.55, -0.30,  0.00]
];

const mockMatrix2 = [
    [ 0.00,  0.10,  0.10,  0.10,  0.10],
    [ 0.10,  0.00,  0.10,  0.10,  0.10],
    [ 0.10,  0.10,  0.00,  0.10,  0.10],
    [ 0.10,  0.10,  0.10,  0.00,  0.10],
    [ 0.10,  0.10,  0.10,  0.10,  0.00]
  ];

const labels = ["Item A", "Item B", "Item C", "Item D", "Item E"];


export default function CorrelationPage({ darkMode }) {

    return (
        <div className={mainContainer}
            style={{ display: 'flex', justifyContent: 'center' }}
        >
            <CorrelationDiagram 
                darkMode={darkMode}
                corrMatrix={mockMatrix}
                labels={labels}
            />
        </div>
    );
}