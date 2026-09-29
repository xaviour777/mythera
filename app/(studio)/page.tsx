import { content, creator001, world001 } from '../../lib/content';
import { Hero } from '../../components/studio/home/Hero';
import { WorldEntry } from '../../components/studio/home/WorldEntry';
import { CreatorCredit, WorldStory } from '../../components/studio/home/WorldStory';
import { MethodBeats } from '../../components/studio/home/MethodBeats';
import {
  Doors,
  Finale,
  HumanLed,
  MethodCopy,
  PartnersSection,
  RightsBlock,
  StudioSection,
} from '../../components/studio/home/Sections';

export default function HomePage() {
  const media = world001.media;
  return (
    <>
      <Hero />
      <WorldEntry
        src={media.keyArt}
        blurDataURL={media.blurDataURL}
        number={world001.number}
        title={world001.title}
        kicker={world001.kicker}
      />
      <WorldStory world={world001} />
      <CreatorCredit creator={creator001} />
      <MethodBeats />
      <MethodCopy />
      <HumanLed />
      <RightsBlock />
      <StudioSection />
      <PartnersSection categories={content.partnerCategories} />
      <Doors keyArt={media.keyArt} blurDataURL={media.blurDataURL} />
      <Finale />
    </>
  );
}
