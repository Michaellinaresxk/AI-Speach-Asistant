<script setup>
import {ref} from "vue"
import {useAVLine } from "vue-audio-visual";
import axios from "axios";

const player = ref(null);
const canvas = ref(null);
let mySource = ref(null);
let action = ref('');
let output = ref('');

useAVLine(player, canvas, {
  src: mySource,
  canvHeight: 300,
  canvWidth: 1000,
  barColor: 'lime'
})

const runSpeechRecognition = () => {
  let SpeechRecognition = SpeechRecognition;
  let recognition = new SpeechRecognition();

  recognition.onstart = () => {
    action.value = "Listening, please ask your question..."
  }

  recognition.onspeechend = () => {
    action.value = "Stopped listening..."
    recognition.stop();
  }

  recognition.onresult = async (event) => {
    let transcript = event.results[0][0].transcript
    output.value = transcript

    try {
      let res = await axios.post(`http://localhost:4001/api/text-to-audio-file`, {
        text: event.results[0][0].transcript
      })

      if(res.data) {
        mySource.value = '/voice/' + res.data + '.mp3'
        setTimeout(() => { player.value.play()}, 500);
      }

    } catch(error) {
      console.log(error)
    }
  }

  recognition.start()
}

</script>

<template>
  <main>
    <div class="btn-section">
      <v-btn prepend-icon="$vuetify"   color="#5865f2" type="button" @click="runSpeechRecognition()">
        Ask question
    </v-btn>
    </div>

    <div class="display-section">
      <div class="action" v-if="action">{{ action }}</div>
      <div class="output" v-if="output"><b>Question:</b>{{ output }}</div>
    </div>


    <div>
      <audio ref="player" :src="mySource" type="audio/mpeg" controls hidden> </audio>
      <canvas ref="canvas" />
    </div>
  </main>
</template>
