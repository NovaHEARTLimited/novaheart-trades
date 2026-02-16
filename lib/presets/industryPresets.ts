export type IndustryPreset = {
  id: string
  name: string
  tradeType: string
}

export const industryPresets: IndustryPreset[] = [
  { id: 'plumber', name: 'Plumber', tradeType: 'Plumber' },
  { id: 'electrician', name: 'Electrician', tradeType: 'Electrician' },
  { id: 'carpenter', name: 'Carpenter', tradeType: 'Carpenter' },
  { id: 'roofer', name: 'Roofer', tradeType: 'Roofer' },
  { id: 'landscaper', name: 'Landscaper', tradeType: 'Landscaper' },
]

// Optional helper for any legacy usage
export const applyPresetToProfile = (profile: Record<string, unknown>, presetId: string) => {
  const preset = industryPresets.find((p) => p.id === presetId)
  if (!preset) return profile
  return {
    ...profile,
    identity: {
      ...(profile?.identity ?? {}),
      tradeType: preset.tradeType,
    },
  }
}