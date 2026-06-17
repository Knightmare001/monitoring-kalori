import server from "./server/index.js";

const PORT = process.env.PORT;
const HOST = process.env.HOST;

server.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
