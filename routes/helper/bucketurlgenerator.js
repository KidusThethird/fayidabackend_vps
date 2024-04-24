const { Storage } = require("@google-cloud/storage");

async function loadCredentials() {
  try {
    //  const credentials = await Storage.getCredentials("../../key.json"); // Replace with the actual path
    const credentials = {
      projectId: "fayidaacadamystorage",
      client_email:
        "fayidaacademyserviceaccount@fayidaacadamystorage.iam.gserviceaccount.com",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCpG4rMhG7qjj19\nvCClwcDnjGIqrH8piWuACsrA6i7eEiuv1RhapFo9IouSP1X8AxJYZTz0cb65sXCv\n1MUWC4Iu8QoSqrUalql0RMddVQqFCj9FMYAMAmG8QnMWkp3GW2N/4St9naDOLVEt\nRppfx1iYgUqMQfP2vI+EyAwNOZpFYHqYJ4f8tPD2htxdyS3elzdIAeh0KP27cesa\nUAp8q6Ye/uoEeVZl1QVrCBFdtKRzY0DJ3mquvOXnRk6YTwYcI+HCmAlRJ/RAUDqb\nJxIoeF8NYCBc+ayx9M5X6358ny2WYbnw9HSZ7tFzlL8KrRmFJFyGyfaJKivYF+Kt\nuC6qFYa9AgMBAAECggEAAKsyYXxVQJ80YLa+6E47rY68D/rOUUM7sMNvftN466Q7\nFlRrkWbcpn49pWPpD/iRI4FZptvQ9cSyXeJOWeJ3btPBhvEJi06KOAKnnoJeFXLv\nbMjKfqxUZ51ZqClcmggK0jAj7w4RsI8JpvoEVURMC4+t/vT/JSbPaHvZXwSvIVQZ\nMnVzGaaJ5EdlZNqlMwmpDmxTsGQG8Z8yCCMGH4jTHKKvZAWhzyhHiDG+Kb8pNlkZ\nberYAy/yUfqN86Jh7JqTv9nh20q/wswDuaOff89WcTYAdLmbM8m1ZnHMc8fiBrVR\nmW70Get5Uy5KEL2pzPH8gGFksk3wXtSRVJA4Nk5eIQKBgQDXtAxHQ+I/vAe0vjg/\n1BiIUy4zCU2qPXJIkwxPC8sQkHNOslIbnZvpbNF7q9VD8MUbNsxky5tuFY8g24WY\n7Ipf6Hx/+9mHGcCXPyGPQI/c80IXcSrhCNKbgJIaoe+c9v0TbH0EJCr+kWesQF2Q\nmDlmwJKy3Y4/kvZ43Hon4wkzsQKBgQDIsxD8y55MU2aeZ2NwaXXddtXnFdvRncyc\nxHO2R5tLgzjFl0aC7vz/NWwQ2Tp1PqWcQaNL0wmW1+4737AEAC9NE5kb2L3UKeks\n1qgHf9u/S+QVs+/LG09zY787xUg0AqdZ4UQKWYn2IEsfRbjbdm4O7f7igf0L8Trv\n3I1vdPvCzQKBgH0DpeYbyuIDeTfg0zrzEvDXvLvplXCoQjcbupOJkzxba+jdYscM\nlpM39UVG9sh0n9hA7z8v3jp0FksFz60s0pn5ZUbL0WwCmeNOvIWI9pgpCFILzb00\n3tMvNf5ngjcn0s9SHjarO5vk7AAiIdgu0X3i+GLgE5R2+ZBcwBOj+u5RAoGAMbiL\nANXBBc+zoJKkg/jchl0maPV1W9zoD/5rXEEpK+/6ZJkxksZ6Tw+BEjt+zAUVKjzo\no6RIv+IG1zZ3eMZC8allSQzNGn63kbAsOI9odV/rxaSqR3sgl8miWsBpPtlZdF7m\naFn+X8doVPsE7PnOEkzL1Hm3ovnETCArue0VYhECgYEAz/kc19iXIuDtm5+rR98i\nDCZu5wrizL3124sznDTbAEKrqoPO5EiEUUElp5Fu9nMQ6FcuxVDVxi65/JHf8gPr\npf/V8oDsYPMbk0oHrpdg2TEHbivTJ+heoUAT/OTppGBNOp9H085FBmEKO7Dj/qAU\nJAc5xYwFfhqmOuLYwB6BT7E=\n-----END PRIVATE KEY-----\n",
    };

    return credentials;
  } catch (error) {
    console.error("Error loading credentials:", error);
    throw error; // Re-throw the error for handling in the route handler
  }
}

exports.generateSignedUrl = async (bucketName, folderPath, filename) => {
  //async function generateSignedUrl(bucketName, folderPath, filename) {
  console.log("I am printed");
  //const storage = new Storage();

  console.log("BucketName: " + bucketName);
  console.log("FolderPath: " + folderPath);
  console.log("FileName: " + filename);

  const credentials = await loadCredentials();
  const storage = new Storage({ credentials });

  const filePath = folderPath ? `${folderPath}/${filename}` : filename;
  const options = {
    action: "read",
    expires: Date.now() + 1000 * 60 * 60, // Expires in 1 hour
  };

  try {
    const url = await storage
      .bucket(bucketName)
      .file(filePath)
      .getSignedUrl(options);
    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
};
