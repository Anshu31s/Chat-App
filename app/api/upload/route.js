import { BlobServiceClient } from '@azure/storage-blob';
import { NextResponse } from 'next/server';


export const config = {
  api: {
    bodyParser: false,
  },
};

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;
const ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;

if (!AZURE_STORAGE_CONNECTION_STRING || !CONTAINER_NAME) {
  throw new Error('Azure Storage connection string and container name are required.');
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

async function parseFormData(request) {
  const data = await request.formData();
  const file = data.get('file');

  if (!file) throw new Error('No file found in form data');

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filename = `${Date.now()}-${file.name}`;

  return { buffer, filename };
}

export async function POST(request) {
  try {
    const { buffer, filename } = await parseFormData(request);
    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    await blockBlobClient.uploadData(buffer);

    const fileUrl = `https://${ACCOUNT_NAME}.blob.core.windows.net/${CONTAINER_NAME}/${filename}`;

    return NextResponse.json({ message: 'File uploaded successfully', fileUrl });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
