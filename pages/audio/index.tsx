import AudioTest from '@/components/audio_player/audio_test/audio'
import React from 'react'

function Audio() {
  return (
    <div id='player'>
      <AudioTest token='037' counter='100' stage='meds' isButton={false}/>
    </div>
  )
}

export default Audio