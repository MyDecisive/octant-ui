type VerifyConnectionConfig = {
  header: string;
  connection: string;
  status: {
    error: string;
    inProgress: string;
    success: string;
  };
};

// TODO: [copy] rename export to VerifyConnectionCopy; it currently shares its name with the page component
export const VerifyConnection = {
  // IC6-01
  header: "Testing data flow in our SmartHub",
  // IC6-02
  connection: "Datadog connection",
  status: {
    // IC6-03
    error: "error",
    // IC6-03
    inProgress: "Validating",
    // IC6-03
    success: "operational",
  },
} satisfies VerifyConnectionConfig;
