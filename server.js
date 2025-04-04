const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Create HTTP Server
const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${server.address().port}`);
});

// Attach WebSocket to the same HTTP server
const wss = new WebSocket.Server({ server });

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

    console.log(`Course Purchased: ${course}`);

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
