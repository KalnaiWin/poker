export function ChatHandlers(io, socket) {
  socket.on("send_message", ({ message, roomId }) => {
    // console.log("Message received:", message, "Room:", roomId);
    io.to(roomId).emit("receive_message", { message, roomId });
  });
}
