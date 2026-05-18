interface IVerifyConnectionCopy {
  header: string;
  connection: string;
  status: {
    error: string;
    inProgress: string;
    success: string;
  };
}

export const VerifyConnectionCopy: IVerifyConnectionCopy = {
  // IC6-01
  header: "Testing data flow in our Smarthub",
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
};
