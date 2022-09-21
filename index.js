const express = require('express');
//const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const port = process.env.PORT || 3000;

const app = express(); app.use(cors()); app.use(express.json());

let SupabaseAPIDeatils =  {
    "URLEndPoint": "https://vftxjowtqpqlbmqjiuyf.supabase.co",
    "AnonPublicAPIKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmdHhqb3d0cXBxbGJtcWppdXlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjM3NDE4OTQsImV4cCI6MTk3OTMxNzg5NH0._uLZvmlPSfeC50i8XvW-e6rX1kYFlLXE1mnBJTgbOBc",
    "ServiceRoleAPIKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmdHhqb3d0cXBxbGJtcWppdXlmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2Mzc0MTg5NCwiZXhwIjoxOTc5MzE3ODk0fQ.gap99tALQ_gjLM7vWypbFZ8-ew1uwjCW58BgbOP38K4",
    "contentType": "application/json"
};

let routes= {
    "/":
    {
        "method": "GET",
        "desc": "Root route."
    },
    "/routes": 
        {
            "method": "GET",
            "desc": "Lists all the routes available"
        },
    "/information": 
        {
            "method": "GET",
            "desc": "Description of the basic information about this API"
        },
    "/getAcc/:limit": 
        {
            "method": "GET",
            "desc": "Retrives the latest 'limit' number of rows from the ESP32_Accelerometer DB Table",
            "paramaters": {
                "limit": "integer, specifies the number of rows wanted to be retrived"
            }
        },
    "/getECG/:limit": 
        {
            "method": "GET",
            "desc": "Retrives the latest 'limit' number of rows from the ESP32_ECG DB Table",
            "paramaters": {
                "limit": "integer, specifies the number of rows wanted to be retrived"
            }
        },  
    "/getMic/:limit": 
        {
            "method": "GET",
            "desc": "Retrives the latest 'limit' number of rows from the ESP32_Mic DB Table",
            "paramaters": {
                "limit": "integer, specifies the number of rows wanted to be retrived"
            }
        },  
    "/getTmp/:limit": 
        {
            "method": "GET",
            "desc": "Retrives the latest 'limit' number of rows from the ESP32_Temperature DB Table",
            "paramaters": {
                "limit": "integer, specifies the number of rows wanted to be retrived"
            }
        },
    
};


const supabase = createClient(SupabaseAPIDeatils.URLEndPoint, SupabaseAPIDeatils.AnonPublicAPIKey);


app.listen(port, () => {
    console.log("Server running on port "+port);
   });

app.get("/", (req, res) => {
    res.json({information: 'This is the root route of HaloBaby Primary API. Kindly navigate to \'/routes\' for more information'});
})

app.get("/information", (req, res) => {
    res.json({description: "This is the HaloBaby primary API. It makes connections with ESP32 module section, the Python + Flask Secondary ML API and frontend applications. It acts as the star to the whole HaloBaby Infrastruture Project."})
})

app.get("/routes", (req, res) => {
    res.json(routes);
   });

app.get("/getTmp/:limit", async (req, res) => {

    try {
//return the last 'limit' values
let data = await supabase
.from('ESP32_Temperature')
.select('*')
.order('created_at', { ascending: false })
.limit(req.params.limit);

if(!(data.error)){
    res.json(data.data);
}
else {
    res.json(data.error);
}
    }
    catch {
        res.sendStatus(500).json({error: 'Error in the \'/getTemp\' block'});
    }

});

app.get("/getAcc/:limit", async (req, res) => {

    try {
//return the last 'limit' values
let data = await supabase
.from('ESP32_Accelerometer')
.select('*')
.order('created_at', { ascending: false })
.limit(req.params.limit);

if(!(data.error)){
    res.json(data.data);
}
else {
    res.json(data.error);
}
    }
    catch {
        res.sendStatus(500).json({error: 'Error in the \'/getAcc\' block'});
    }

});

app.get("/getMic/:limit", async (req, res) => {

    try {
//return the last 'limit' values
let data = await supabase
.from('ESP32_Mic')
.select('*')
.order('created_at', { ascending: false })
.limit(req.params.limit);

if(!(data.error)){
    res.json(data.data);
}
else {
    res.json(data.error);
}
    }
    catch {
        res.sendStatus(500).json({error: 'Error in the \'/getMic\' block'});
    }

});

app.get("/getECG/:limit", async (req, res) => {

    try {
//return the last 'limit' values
let data = await supabase
.from('ESP32_ECG')
.select('*')
.order('created_at', { ascending: false })
.limit(req.params.limit);

if(!(data.error)){
    res.json(data.data);
}
else {
    res.json(data.error);
}
    }
    catch {
        res.sendStatus(500).json({error: 'Error in the \'/getECG\' block'});
    }

});

app.get("/emotionPrime", async (req, res) => {
    let data;
    try {
        //return the last three values
        data = await supabase
        .from('ESP32_ECG')
        .select('value')
        .order('created_at', { ascending: false })
        .limit(3);
        
        if(!(data.error)){
            let concatedData = (data.data[2].value) + (data.data[1].value) + (data.data[0].value);
            res.json(concatedData);
            //create axios async function, sent it to Python API, and return the result to .res;

        }
        else {
            res.json(data.error);
        }
            }
            catch {
                res.sendStatus(500).json({error: 'Error in the \'/emotionPrime\' block'});
            }

})


