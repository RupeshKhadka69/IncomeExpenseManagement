const corsOption = {
    origin: [
      "http://localhost:3000",
      "http://localhost:7002",
  
      "https://demo.nhmis.com",
      "https://demo-admin.nhmis.com",
  
      "https://www.nhmis.com",
      "https://www.demo-admin.nhmis.com",
  
      "https://nagariksolution.com",
  
      "https://www.nagariksolution.com",
  
      "http://localhost:10002",
  
      "https://pheta.nhmis.com",
  
      "https://www.pheta.nhmis.com",
  
      "https://jagarnathpur.nhmis.com",
  
      "https://www.jagarnathpur.nhmis.com",
  
      "https://karaiyamai.nhmis.com",
  
      "https://www.karaiyamai.nhmis.com",
  
      "https://dhis2.nhmis.com",
  
      "https://www.dhis2.nhmis.com",
    ],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    credentials: true,
  };
  
  export default corsOption