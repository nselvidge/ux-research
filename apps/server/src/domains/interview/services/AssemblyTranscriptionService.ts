import { Settings } from "@root/global/Settings";
import axios from "axios";
import { request } from "https";
import pino from "pino";
import { inject, injectable } from "tsyringe";
import {
  TranscriptionService,
  VideoStorageService,
} from "../interactors/InteractorServices";
import { RawSerializedTranscript } from "../interactors/serializers/SerializedTranscript";

type AssemblyWord = {
  start: number;
  end: number;
  text: string;
};

type AssemblyUtternace = {
  text: string;
  start: number;
  end: number;
  speaker: string;
  words: AssemblyWord[];
};

type AssemblyTranscript = {
  id: string;
  status: "queued" | "processing" | "completed" | "error";
  utterances: AssemblyUtternace[];
};

@injectable()
export class AssemblyTranscriptionService implements TranscriptionService {
  private readonly baseUrl = "https://api.assemblyai.com/v2";
  constructor(
    private settings: Settings,
    @inject("Logger") private logger: pino.Logger
  ) {}

  getAssemblyToken = () => {
    const assemblyToken = this.settings.getSetting("assemblyAIToken");
    if (!assemblyToken) {
      throw new Error(
        "assemblyAIToken must be set in settings to use assemblyAI integration"
      );
    }
    return assemblyToken;
  };

  uploadRecordingToAssembly = async (
    recordingId: string,
    videoStorageService: VideoStorageService
  ): Promise<string> => {
    const assemblyToken = this.getAssemblyToken();

    const response = await new Promise<{ upload_url: string }>(
      (resolve, reject) => {
        const req = request(
          `${this.baseUrl}/upload`,
          {
            method: "POST",
            headers: {
              authorization: assemblyToken,
              "content-type": "application/json",
              "transfer-encoding": "chunked",
            },
          },
          (res) => {
            let data = "";
            res.on("data", (chunk) => {
              data += chunk;
            });
            res.on("error", (err) => {
              this.logger.error(err, "assembly upload response error");
              reject(err);
            });
            res.on("end", () => {
              resolve(JSON.parse(data));
            });
          }
        );

        videoStorageService
          .getVideoSize(`${recordingId}.mp4`)
          .then((size) =>
            videoStorageService.getVideoStream(`${recordingId}.mp4`, 0, size)
          )
          .then((stream) => {
            stream.on("data", (chunk) => req.write(chunk));
            stream.on("error", (err) => console.error("errored", err));
            stream.on("end", () => {
              req.end();
            });
          })
          .catch(reject);
      }
    );

    if (!response.upload_url) {
      throw new Error("failed to get upload url from assemblyai");
    }

    return response.upload_url;
  };

  createAssemblyTranscript = async (
    publicUrl: string
  ): Promise<AssemblyTranscript> => {
    const assemblyToken = this.getAssemblyToken();

    const assembly = axios.create({
      baseURL: this.baseUrl,
      headers: {
        authorization: assemblyToken,
        "content-type": "application/json",
      },
    });
    const webhook_url =
      this.settings.getSetting("redirectUrl") + "/assembly/transcript-ready";

    const response = await assembly.post("/transcript", {
      audio_url: publicUrl,
      speaker_labels: true,
      webhook_url,
    });

    return response.data;
  };

  getTranscriptById = async (id: string): Promise<RawSerializedTranscript> => {
    const assemblyToken = this.getAssemblyToken();

    const assembly = axios.create({
      baseURL: this.baseUrl,
      headers: {
        authorization: assemblyToken,
        "content-type": "application/json",
      },
    });

    const res = await assembly.get(`/transcript/${id}`);

    return this.parseAssemblyTranscript(res.data);
  };

  parseAssemblyTranscript = async ({
    id,
    status,
    utterances,
  }: AssemblyTranscript): Promise<RawSerializedTranscript> => ({
    id,
    isPending: status !== "completed",
    isRaw: true,
    groups:
      utterances?.map(({ start, end, speaker, words }, i) => ({
        transcriptId: id,
        start,
        end,
        speakerLabel: speaker,
        groupNumber: i,
        words: words?.map(({ text, start, end }, j) => ({
          transcriptId: id,
          text,
          start,
          end,
          wordNumber: j,
          groupNumber: i,
        })),
      })) || [],
  });

  generateTranscript = async (
    videoDownloadUrl: string
  ): Promise<RawSerializedTranscript> => {
    const rawTranscript = await this.createAssemblyTranscript(videoDownloadUrl);

    return this.parseAssemblyTranscript(rawTranscript);
  };
}
