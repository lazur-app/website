import "./engine/fonts";
import { Composition } from "remotion";
import { Film } from "./engine/Film";
import { FPS, layout } from "./engine/timing";
import { FILMS } from "./films";

// Every film registers twice: "<id>" with sound effects + music, "<id>-silent" without.
export const RemotionRoot: React.FC = () => (
  <>
    {FILMS.flatMap((spec) => [
      <Composition
        key={spec.id}
        id={spec.id}
        component={Film}
        defaultProps={{ spec, sound: true }}
        durationInFrames={Math.max(1, layout(spec).frames)}
        fps={FPS}
        width={spec.width}
        height={spec.height}
      />,
      <Composition
        key={`${spec.id}-silent`}
        id={`${spec.id}-silent`}
        component={Film}
        defaultProps={{ spec, sound: false }}
        durationInFrames={Math.max(1, layout(spec).frames)}
        fps={FPS}
        width={spec.width}
        height={spec.height}
      />,
    ])}
  </>
);
