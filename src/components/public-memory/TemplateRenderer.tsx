import React from 'react';
import { Memory } from '../../types';
import { RoseGardenTemplate } from './templates/RoseGardenTemplate';
import { LuxuryGoldTemplate } from './templates/LuxuryGoldTemplate';
import { GalaxyLoveTemplate } from './templates/GalaxyLoveTemplate';
import { ElegantBirthdayTemplate } from './templates/ElegantBirthdayTemplate';
import { VintageScrapbookTemplate } from './templates/VintageScrapbookTemplate';
import { AudioPlayer } from '../shared/AudioPlayer';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { useApp } from '../../context/AppContext';

interface TemplateRendererProps {
  memory: Memory;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ memory }) => {
  const { music, templates } = useApp();

  const selectedMusic = music.find(m => m.id === memory.musicId);
  const selectedTemplate = templates.find(t => t.id === memory.templateId);
  const templateSlug = selectedTemplate?.slug || memory.templateId;

  const renderTemplate = () => {
    switch (templateSlug) {
      case 'rose-garden':
      case 'tmpl_rose_garden':
        return <RoseGardenTemplate memory={memory} />;
      case 'luxury-gold':
      case 'tmpl_luxury_gold':
        return <LuxuryGoldTemplate memory={memory} />;
      case 'galaxy-love':
      case 'tmpl_galaxy_love':
        return <GalaxyLoveTemplate memory={memory} />;
      case 'elegant-birthday':
      case 'tmpl_elegant_birthday':
        return <ElegantBirthdayTemplate memory={memory} />;
      case 'vintage-scrapbook':
      case 'tmpl_vintage_scrapbook':
        return <VintageScrapbookTemplate memory={memory} />;
      default:
        return <RoseGardenTemplate memory={memory} />;
    }
  };

  return (
    <div className="relative min-h-screen">
      <ErrorBoundary>
        {renderTemplate()}
      </ErrorBoundary>
      {selectedMusic && <AudioPlayer music={selectedMusic} />}
    </div>
  );
};
