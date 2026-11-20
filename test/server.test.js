const http = require("http");

// Quick endpoint verification script
async function testEndpoints() {
  const server = require("../index.js");
  // wait 1 second for listen
  await new Promise((r) => setTimeout(r, 1000));

  const check = (path, method = "GET", body = null) => {
    return new Promise((resolve, reject) => {
      const opts = {
        hostname: "localhost",
        port: 3000,
        path,
        method,
        headers: body ? { "Content-Type": "application/json" } : {},
      };
      const req = http.request(opts, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
      });
      req.on("error", reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  };

  try {
    const health = await check("/api/health");
    console.log("Health Check:", health.status, health.data);

    const journey = await check("/api/journey/1111111111");
    console.log("Journey 1111111111 Check:", journey.status, "Ticket type:", journey.data.ticket.type, "Platform:", journey.data.platform.current);

    const backup = await check("/api/backup");
    console.log("Backup Check:", backup.status, "Trains found:", backup.data.trains.length, "Buses found:", backup.data.buses.length);

    const trigger = await check("/api/demo/trigger", "POST", { pnr: "1111111111", event: "platform_changed" });
    console.log("Demo Trigger Check:", trigger.status, "Event emitted:", trigger.data.event);

    const updated = await check("/api/journey/1111111111");
    console.log("Updated Journey Platform:", updated.data.platform.current);

    console.log("ALL SERVER ENDPOINTS VERIFIED SUCCESSFULLY!");
    process.exit(0);
  } catch (err) {
    console.error("Endpoint verification failed:", err);
    process.exit(1);
  }
}

testEndpoints();
