import CorrelationDiagram from "../components/Analysis/CorrelationDiagram";
import SelectionBar from "../components/Analysis/SelectionBar";
import { mainContainer } from "../utils/tailwindClasses";
import { useState, useEffect } from 'react';

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


export default function AnalysisPage({ darkMode, itemList }) {
    const [labels, setLabels] = useState([]);
    const [corrMatrix, setCorrMatrix] = useState([]);

    const fetchCorrelations = async (newItemId) => {
        const response = await fetch('/api/correlations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                newItemId: newItemId,
                currentItemIds: labels,
            })
        })
        const newCorrelations = await response.json();
        return newCorrelations;
    }
    
    const updateMatrix = (newItemId, correlations) => {
        // Add item to chord diagram
        /**
         * {
                "newItem": "ItemX",
                "correlations": [
                    { "item": "ItemA", "value": 0.35 },
                    { "item": "ItemB", "value": -0.20 },
                    { "item": "ItemC", "value": 0.50 }
                ]
            }

        */
        // Shld this be before or after ?
        setLabels((prev) => [...prev, ]);

        setCorrMatrix((prev) => {
            const newMatrix = prev.map((row, i) => {
                const corrObj = correlations.find(corr => corr.itemId === labels[i]);
                return [...row, corrObj ? corrObj.value : 0.00];
            });
        

            const newRow = labels.map(label => {
                const corrObj = correlations.find(corr => corr.itemId === label);
                return corrObj ? corrObj.value : 0;
            });

            // Add corr with itself -- assumes this is not part of Flask response
            newRow.push(1.00);

            newMatrix.push(newRow);

            return newMatrix;
        });
    }

    const handleOptionSelect = async (itemId) => {
        if (itemId) {

            const newCorrelations = await fetchCorrelations(itemId);
            
            updateMatrix(itemId, newCorrelations);
            
          return;
        }
    };


    return (
        <div className={mainContainer}
            style={{ display: 'flex', justifyContent: 'space-between' }}
        >
            <div >
                <SelectionBar
                    itemList={itemList}
                    handleOptionSelect={handleOptionSelect}
                />
            </div>
            
            <div >
                <CorrelationDiagram 
                    darkMode={darkMode}
                    corrMatrix={mockMatrix}
                    labels={labels}
                />
            </div>
            
            <div >
                <h1>Selected items list go here</h1>
            </div>
            
        </div>
    );
}