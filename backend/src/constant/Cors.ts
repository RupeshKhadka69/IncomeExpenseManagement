const corsOption = {
  origin: ["*", "http://localhost:3000"],
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  credentials: true,
};

export default corsOption;
