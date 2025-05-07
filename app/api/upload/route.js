import s3 from "@/lib/s3";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { fileName, fileType } = req.body;

    try {
      // Generate a pre-signed URL for direct upload
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Expires: 60, 
        ContentType: fileType,
      };

      const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
      res.status(200).json({ uploadUrl, fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}