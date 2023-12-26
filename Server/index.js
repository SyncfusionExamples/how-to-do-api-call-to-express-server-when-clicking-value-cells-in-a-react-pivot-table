// Middleware for parsing JSON and handling CORS 
import express from 'express';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(cors());

// Endpoint to handle updates to the pivot table data
app.use("/data", (req,res) => {
    try{
        console.log(req.body);
        let dataFromReact=req.body;
        // Delete the specific raw data of the cells from the data source if we have data in the cell.
        if(dataFromReact.data.value>0){
            dataFromReact.pivotData.splice(Object.keys(dataFromReact.data.indexObject),1);
            res.status(200).send(dataFromReact.pivotData);
        } else{
            // Added the raw data based on the cell combinations to the pivot table if the cell is empty.
            let newData={
                "Sold": 40,
                "Country": dataFromReact.data.rowHeaders,
                "Year": dataFromReact.data.columnHeaders
            };
            dataFromReact.pivotData.push(newData);
            // Send back the updated data source to the client
            res.status(200).send(dataFromReact.pivotData);
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

// Define the port for the server here. 
app.listen(5000,()=>{
    console.log("Server is running on port 5000");
});
