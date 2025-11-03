import test from 'node:test';
import assert from 'node:assert';
import {
  searchEpisodesArgsSchema,
  getShowInfoArgsSchema,
  listShowsArgsSchema,
  getEpisodeInfoArgsSchema,
  searchTopicsArgsSchema,
  askCodingQuestionArgsSchema,
} from './server';
import {
  shows,
  episodes,
  categories,
  getShowById,
  getShowsByCategory,
  getEpisodeById,
  getEpisodesByShow,
  searchEpisodesByTopic,
  searchEpisodesByKeyword,
  getActiveShows,
  getCategoryById,
} from './radiobh-knowledge';

test('Radio BH Knowledge Base', async (t) => {
  
  await t.test('Shows are properly defined', () => {
    assert(shows.length > 0, 'Should have shows');
    const codeMasters = shows.find(s => s.id === 'code-masters');
    assert(codeMasters, 'Code Masters show should exist');
    assert.strictEqual(codeMasters?.startYear, 1997, 'Code Masters started in 1997');
    assert.strictEqual(codeMasters?.active, true, 'Code Masters is active');
  });
  
  await t.test('Episodes are properly defined', () => {
    assert(episodes.length > 0, 'Should have episodes');
    const firstEpisode = episodes.find(e => e.id === 'ep-001');
    assert(firstEpisode, 'First episode should exist');
    assert.strictEqual(firstEpisode?.showId, 'code-masters', 'First episode belongs to Code Masters');
  });
  
  await t.test('Categories are properly defined', () => {
    assert(categories.length > 0, 'Should have categories');
    const techCategory = categories.find(c => c.id === 'tech');
    assert(techCategory, 'Tech category should exist');
    assert.strictEqual(techCategory?.name, 'Technology & Innovation');
  });
  
  await t.test('getShowById works correctly', () => {
    const show = getShowById('code-masters');
    assert(show, 'Should find Code Masters');
    assert.strictEqual(show?.name, 'Code Masters');
  });
  
  await t.test('getShowsByCategory works correctly', () => {
    const techShows = getShowsByCategory('tech');
    assert(techShows.length > 0, 'Should have tech shows');
    assert(techShows.every(s => s.category === 'tech'), 'All returned shows should be tech category');
  });
  
  await t.test('getEpisodeById works correctly', () => {
    const episode = getEpisodeById('ep-150');
    assert(episode, 'Should find episode');
    assert(episode?.title.includes('Laravel'), 'Episode should be about Laravel');
  });
  
  await t.test('getEpisodesByShow works correctly', () => {
    const codeMastersEps = getEpisodesByShow('code-masters');
    assert(codeMastersEps.length > 0, 'Should have Code Masters episodes');
    assert(codeMastersEps.every(e => e.showId === 'code-masters'), 'All episodes should belong to Code Masters');
  });
  
  await t.test('searchEpisodesByTopic works correctly', () => {
    const laravelEps = searchEpisodesByTopic('Laravel');
    assert(laravelEps.length > 0, 'Should find Laravel episodes');
    const reactEps = searchEpisodesByTopic('React');
    assert(reactEps.length > 0, 'Should find React episodes');
  });
  
  await t.test('searchEpisodesByKeyword works correctly', () => {
    const results = searchEpisodesByKeyword('TypeScript');
    assert(results.length > 0, 'Should find TypeScript episodes');
  });
  
  await t.test('getActiveShows works correctly', () => {
    const activeShows = getActiveShows();
    assert(activeShows.length > 0, 'Should have active shows');
    assert(activeShows.every(s => s.active === true), 'All should be active');
  });
  
  await t.test('getCategoryById works correctly', () => {
    const category = getCategoryById('tech');
    assert(category, 'Should find tech category');
    assert.strictEqual(category?.name, 'Technology & Innovation');
  });
});

test('Radio BH Tool Schemas', async (t) => {
  
  await t.test('searchEpisodesArgsSchema validation', () => {
    // Valid input
    const valid1 = searchEpisodesArgsSchema.safeParse({
      query: "Laravel"
    });
    assert(valid1.success, 'Valid input should parse');
    assert.strictEqual(valid1.data?.query, "Laravel");
    
    // Valid with showId
    const valid2 = searchEpisodesArgsSchema.safeParse({
      query: "React",
      showId: "code-masters"
    });
    assert(valid2.success, 'Valid input with showId should parse');
    
    // Invalid - missing query
    const invalid1 = searchEpisodesArgsSchema.safeParse({});
    assert(!invalid1.success, 'Missing query should fail');
  });
  
  await t.test('getShowInfoArgsSchema validation', () => {
    // Valid input
    const valid = getShowInfoArgsSchema.safeParse({
      showId: "code-masters"
    });
    assert(valid.success, 'Valid input should parse');
    
    // Invalid - missing showId
    const invalid = getShowInfoArgsSchema.safeParse({});
    assert(!invalid.success, 'Missing showId should fail');
  });
  
  await t.test('listShowsArgsSchema validation', () => {
    // Valid - no params (optional)
    const valid1 = listShowsArgsSchema.safeParse({});
    assert(valid1.success, 'Empty input should parse');
    assert.strictEqual(valid1.data?.activeOnly, true, 'Default activeOnly should be true');
    
    // Valid with categoryId
    const valid2 = listShowsArgsSchema.safeParse({
      categoryId: "tech",
      activeOnly: false
    });
    assert(valid2.success, 'Valid input with params should parse');
    assert.strictEqual(valid2.data?.activeOnly, false);
  });
  
  await t.test('getEpisodeInfoArgsSchema validation', () => {
    // Valid input
    const valid = getEpisodeInfoArgsSchema.safeParse({
      episodeId: "ep-001"
    });
    assert(valid.success, 'Valid input should parse');
    
    // Invalid - missing episodeId
    const invalid = getEpisodeInfoArgsSchema.safeParse({});
    assert(!invalid.success, 'Missing episodeId should fail');
  });
  
  await t.test('searchTopicsArgsSchema validation', () => {
    // Valid input
    const valid = searchTopicsArgsSchema.safeParse({
      topic: "Node.js"
    });
    assert(valid.success, 'Valid input should parse');
    
    // Invalid - missing topic
    const invalid = searchTopicsArgsSchema.safeParse({});
    assert(!invalid.success, 'Missing topic should fail');
  });
  
  await t.test('askCodingQuestionArgsSchema validation', () => {
    // Valid input - minimal
    const valid1 = askCodingQuestionArgsSchema.safeParse({
      question: "How do I use Laravel middleware?"
    });
    assert(valid1.success, 'Valid minimal input should parse');
    assert.strictEqual(valid1.data?.model, 'compound-beta', 'Default model should be compound-beta');
    
    // Valid input - with context and model
    const valid2 = askCodingQuestionArgsSchema.safeParse({
      question: "Optimize React performance",
      context: "Large component tree",
      model: "compound-beta-mini"
    });
    assert(valid2.success, 'Valid full input should parse');
    assert.strictEqual(valid2.data?.model, 'compound-beta-mini');
    
    // Invalid - missing question
    const invalid = askCodingQuestionArgsSchema.safeParse({});
    assert(!invalid.success, 'Missing question should fail');
  });
});
