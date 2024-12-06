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

const mockLabels = ["12", "3215", "14", "4364", "1234"];


export default function AnalysisPage({ darkMode, itemList, idToNameMap }) {
    const url = process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5000"
    : "https://runescape-tracker.impaas.uk";

    const [labels, setLabels] = useState([]);
    const [corrMatrix, setCorrMatrix] = useState([[]]);

    const fetchCorrelations = async (newItemId) => {
        console.log('NEW ID: ', newItemId);
        console.log('LABELS:', labels);

        const response = await fetch(`${url}/api/correlations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                target_item_id: newItemId,
                item_id_list: labels
            })
        })
        const newCorrelations = await response.json();

        console.log('NEW CORRELATIONS:', newCorrelations);
        return newCorrelations;
    }
    
    const updateMatrix = (newItemId, correlations) => {
        setCorrMatrix((prev) => {
            const newRow = []  // empty list for new item's row

            const newMatrix = prev.map((row, i) => {
                const corrMapValue = correlations[labels[i]];
                // If there is no corr data for the ID, just assume no corr exists
                const newCorr = corrMapValue !== undefined ? corrMapValue : 0.00;
                newRow.push(newCorr);  // also push corr to new item's row
                return [...row, newCorr];
            })
            
            // Add self-corr to the new item's row (not part of Flask response)
            // (using 0.00 not 1.00 to force d3 diagram to ignore it)
            newRow.push(0.00);
            // Add the new item row to the matrix
            newMatrix.push(newRow);
            // Add the new item to the end of the labels list
            setLabels((prev) => [...prev, newItemId]);

            return newMatrix;
        });
    }

    const handleOptionSelect = async (itemId) => {
        console.log('HANDLING SELECT', itemId);
        if (itemId) {
            // If first item, just add it to the matrix (no fetch needed)
            if (corrMatrix[0].length == 0) {
                console.log('CORR MATRIX EMPTY');
                setCorrMatrix([[0.00]]);
                setLabels([itemId]);
                console.log("LABELS FROM OPTION SELECT: ", labels);
                return;
            }
            // Get relevant correlation data
            const newCorrelations = await fetchCorrelations(itemId);
            // Update the matrix to reflect the new data
            updateMatrix(itemId, newCorrelations);
        } else {
            console.log('Option select failed.')
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
                    corrMatrix={corrMatrix}
                    labels={labels}
                    idToNameMap={idToNameMap}
                />
            </div>
            
            <div >
                <h1>Selected items list go here</h1>
            </div>
            
        </div>
    );
}