// frontend/src/bracket/seedAssignment.test.ts

import { assignSeedsToBracketSlots } from './seedAssignment';
import { BRACKET_TEMPLATE } from './template';
import { mockTeams } from '../test/fixtures/teams';

describe('seedAssignment', () => {
  describe('assignSeedsToBracketSlots', () => {
    it('assigns team IDs to bracket positions based on seeds', () => {
      const slots = assignSeedsToBracketSlots(mockTeams);

      expect(slots).toHaveLength(BRACKET_TEMPLATE.length);

      // Find Champ R1 Top slot (seeds 4 vs 5)
      const champR1Top = slots.find((s) => s.id === 'champ_r1_top');
      expect(champR1Top).toBeDefined();
      expect(champR1Top!.positions[0]?.seed).toBe(4);
      expect(champR1Top!.positions[0]?.teamId).toBe(4); // roster_id for seed 4
      expect(champR1Top!.positions[1]?.seed).toBe(5);
      expect(champR1Top!.positions[1]?.teamId).toBe(5);
    });

    it('assigns seeds 1 and 2 to champ R2 positions', () => {
      const slots = assignSeedsToBracketSlots(mockTeams);

      const champR2Top = slots.find((s) => s.id === 'champ_r2_top');
      expect(champR2Top).toBeDefined();
      expect(champR2Top!.positions[0]?.seed).toBe(1);
      expect(champR2Top!.positions[0]?.teamId).toBe(1); // roster_id 1
    });

    it('assigns toilet bowl seeds 7-12', () => {
      const slots = assignSeedsToBracketSlots(mockTeams);

      const toiletR1Top = slots.find((s) => s.id === 'toilet_r1_top');
      expect(toiletR1Top).toBeDefined();
      expect(toiletR1Top!.positions[0]?.seed).toBe(8);
      expect(toiletR1Top!.positions[0]?.teamId).toBe(8);
      expect(toiletR1Top!.positions[1]?.seed).toBe(9);
      expect(toiletR1Top!.positions[1]?.teamId).toBe(9);
    });

    it('preserves BYE positions without team IDs', () => {
      const slots = assignSeedsToBracketSlots(mockTeams);

      // Keeper bowl floaters start as BYE (fed by champ losers)
      const keeperFloater1 = slots.find((s) => s.id === 'keeper_floater_1');
      expect(keeperFloater1).toBeDefined();
      expect(keeperFloater1!.positions[0]?.teamId).toBeUndefined();
      expect(keeperFloater1!.isBye).toBe(true);
    });

    it('does not mutate original template', () => {
      const originalLength = BRACKET_TEMPLATE.length;
      const originalFirstSlot = { ...BRACKET_TEMPLATE[0] };

      assignSeedsToBracketSlots(mockTeams);

      expect(BRACKET_TEMPLATE).toHaveLength(originalLength);
      expect(BRACKET_TEMPLATE[0].id).toBe(originalFirstSlot.id);
    });

    it('handles teams without seeds gracefully', () => {
      const teamsWithoutSeeds = mockTeams.map((t) => ({ ...t, seed: undefined }));

      const slots = assignSeedsToBracketSlots(teamsWithoutSeeds);

      // Should still return slots but without team IDs assigned
      expect(slots).toHaveLength(BRACKET_TEMPLATE.length);
      const champR1Top = slots.find((s) => s.id === 'champ_r1_top');
      expect(champR1Top!.positions[0]?.teamId).toBeUndefined();
    });
  });
});
