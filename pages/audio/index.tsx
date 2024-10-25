import AudioTest from '@/components/audio_player/audio_test/audio'
import SequentialAudioPlayerFinish from '@/components/audio_player/finish/audio'
import React from 'react'

function Audio() {
  return (
    <div>
      <AudioTest token='4567' counter='100'/>
    </div>
  )
}

export default Audio