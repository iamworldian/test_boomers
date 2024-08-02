const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  credentials: {
      accessKeyId: "AKIA5CPQH7COFCFZ4MHX", 
      secretAccessKey: "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"
  },
  region: "us-east-1",
});


module.exports = s3;

