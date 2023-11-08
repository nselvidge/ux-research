import { ViewerInteractor } from "@root/domains/video/interactors/ViewerInteractor";
import { injectable } from "tsyringe";
import DataLoader from "dataloader";
import { GatewayVideo } from "@root/domains/video/interactors/serializers/SerializedVideo";

@injectable()
export class VideoLoader {
  constructor(private viewer: ViewerInteractor) {}
  createLoader = () => {
    return new DataLoader<string, GatewayVideo | undefined>(
      async (ids: readonly string[]) => {
        const videos = await this.viewer.getVideosByIds([...ids]);
        return ids.map((id) => videos.find((video) => video.id === id));
      }
    );
  };
}
