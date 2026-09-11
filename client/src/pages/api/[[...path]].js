import app from "../../../server/app.js";

// Express reads the raw request stream for JSON and multipart image uploads.
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default function handler(req, res) {
  return app(req, res);
}
