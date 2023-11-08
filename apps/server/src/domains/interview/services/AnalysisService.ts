import { Settings } from "@root/global/Settings";
import fetch from "node-fetch";
import { flatMap, indexBy, map, pipe, reduce } from "remeda";
import { injectable } from "tsyringe";
import { SummarizationService } from "../interactors/InteractorServices";
import { SerializedParticipant } from "../interactors/serializers/SerializedParticipant";
import { SerializedTranscript } from "../interactors/serializers/SerializedTranscript";

@injectable()
export class AnalysisService implements SummarizationService {
  constructor(private settings: Settings) {}
  async generateSummary(transcript: SerializedTranscript, speakers: SerializedParticipant[]): Promise<string> {
    const speakerDict = indexBy(speakers, (speaker) => speaker.id);

    // group words into sentences and start each sentence with the speaker name on a new line
    const document = pipe(
      transcript.groups,
      flatMap((group) => group.words.map((word) => ({ ...word, speakerId: group.speakerId }))),
      reduce((acc, word) => {
        const lastSentence = acc[acc.length - 1];
        if (lastSentence && lastSentence[lastSentence.length - 1]?.speakerId === word.speakerId && !/[.?!]/.test(lastSentence[lastSentence.length - 1]?.text)) {
          lastSentence.push(word);
        } else {
          acc.push([word]);
        }
        return acc;
      }  
      , [] as {speakerId: string, text: string}[][]),
      map((words) => {
        const speaker = speakerDict[words[0].speakerId];
        return `${speaker.name}: ${words.map((word) => word.text).join(" ")}`;
      })
    ).join("\n");

    const result = await fetch(`${this.settings.getSetting("analysisServiceUrl")}/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: document,
      }),
    });


    if (!result.ok) {
      throw new Error("Analysis service failed");
    }

    const data = await result.json();

    return data.summary;
  }
}