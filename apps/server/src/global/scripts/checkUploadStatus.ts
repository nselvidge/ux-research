import { prisma } from "./scriptUtils";

import { container } from "tsyringe";
import { MuxService } from "../../domains/video/services/MuxService";
prisma;
const mux = container.resolve(MuxService);

// const uploadId = "qayWhi48kgCaLzegaga1H8aDz02FAKyVlwxPjR5Jd5xQ";
const uploadId = "BuDj4MKSKjm3xSv00XQX3N02ipGEF00zR7Ev5OFKNSqoZU";

const getUploadStatus = async () => {
  // get upload details from MuxService
  const upload = await mux.getUploadStatus(uploadId);
};

getUploadStatus();
