let io = null;

export const initSocket = (socketIoInstance) => {
  io = socketIoInstance;

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join workspace room
    socket.on('join_workspace', (workspaceId) => {
      if (workspaceId) {
        socket.join(`workspace_${workspaceId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined workspace_${workspaceId}`);
      }
    });

    // Join user notification room
    socket.on('join_user', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined user_${userId}`);
      }
    });

    // Leave workspace room
    socket.on('leave_workspace', (workspaceId) => {
      if (workspaceId) {
        socket.leave(`workspace_${workspaceId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => {
  return io;
};

export const emitToWorkspace = (workspaceId, event, data) => {
  if (io && workspaceId) {
    io.to(`workspace_${workspaceId}`).emit(event, data);
  }
};

export const emitToUser = (userId, event, data) => {
  if (io && userId) {
    io.to(`user_${userId.toString()}`).emit(event, data);
  }
};
