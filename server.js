const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Create WebSocket Server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

let clients = []; // Store connected clients

wss.on("connection", (ws) => {
    console.log("Client connected");
    clients.push(ws);

    ws.on("close", () => {
        clients = clients.filter(client => client !== ws);
        console.log("Client disconnected");
    });
});

// API Route to simulate a course purchase
app.post("/purchase", (req, res) => {
    const { course } = req.body;

    console.log(`Course Purchased: ${course}`); // Debugging

    // Send notification to all connected clients
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                title: "Course Purchased",
                message: `${course} was purchased! 🎉`,
            }));
        }
    });

    res.json({ success: true, message: "Notification sent!" });
});

// Start Express Server
app.listen(3000, () => console.log("Server running on port 3000"));
