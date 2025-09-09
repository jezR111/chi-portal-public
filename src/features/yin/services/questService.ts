// src/features/yin/services/questService.ts
class QuestService {
  // MVP methods
  getAvailableQuests(): Quest[]
  completeQuest(questId: string): void
  getXPReward(quest: Quest): number
  
  // Structure for future methods (empty implementations)
  verifyQuest?(questId: string, verification: any): boolean
  scheduleQuest?(questId: string, time: Date): void
  getQuestChain?(chainId: string): Quest[]
  calculateModifiers?(quest: Quest): number
}