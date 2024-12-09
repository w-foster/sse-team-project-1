import CorrelationDiagram from "../components/Analysis/CorrelationDiagram";
import SelectionBar from "../components/Analysis/SelectionBar";
import CorrelationLegend from "../components/Analysis/CorrelationLegend";
import SelectedItemList from "../components/Analysis/SelectedItemList";
import { mainContainer } from "../utils/tailwindClasses";
import { useState, useEffect } from 'react';

const url = process.env.NODE_ENV === "development"
? "http://127.0.0.1:5000"
: "https://runescape-tracker.impaas.uk";

// EXAMPLE SELECTION OF ITEMS FOR GRAPH
const demoItems = [8008, 11943, 64, 9416, 4151, 10344, 5044, 5046, 12437, 563]

export default function AnalysisPage({ darkMode, itemList, idToNameMap }) {
    const [labels, setLabels] = useState([]);
    const [corrMatrix, setCorrMatrix] = useState([]);


    const fetchCorrelations = async (newItemId) => {
        const response = await fetch(`${url}/api/correlations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                target_item_id: newItemId,
                item_id_list: labels
            })
        })
        const newCorrelations = await response.json();
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
        if (itemId) {
            // If first item, just add it to the matrix (no fetch needed)
            if (Array.isArray(corrMatrix) && corrMatrix.length == 0) {
                setCorrMatrix([[0.00]]);
                setLabels([itemId]);
            } else {
                // Get relevant correlation data
                const newCorrelations = await fetchCorrelations(itemId);
                // Update the matrix to reflect the new data
                updateMatrix(itemId, newCorrelations);
            }

        } else {
            console.log('Option select failed.')
        }
    };

    const handleClickDelete = (itemId) => {
        if (itemId) {
            // Remove item id from labels
            setLabels((prev) => (
                prev.filter(item => item !== itemId)
            ));
            // Remove each item's corr. with deleted item in corrMatrix
            const index = labels.findIndex(label => label === itemId);
            setCorrMatrix((prev) =>
                prev
                .filter((_, i) => i !== index) // remove index-th row
                .map(row => row.filter((_, i) => i !== index)) // remove index-th col
            );

        } else {
            console.log('Item delete failed.')
        }
    }


    return (
        <div className={mainContainer}
            style={{ display: 'flex', justifyContent: 'space-between' }}
        >
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <SelectionBar
                    itemList={itemList}
                    handleOptionSelect={handleOptionSelect}
                />
                <SelectedItemList 
                    selectedItems={labels}
                    handleClickDelete={handleClickDelete}
                    idToNameMap={idToNameMap}
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
                <br />
                <CorrelationLegend 
                    darkMode={darkMode}
                />
            </div>
            
        </div>
    );
}