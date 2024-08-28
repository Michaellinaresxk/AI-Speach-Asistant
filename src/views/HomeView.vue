<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import {ref} from "vue"
import {useAVLine } from "vue-audio-visual";
import axios from "axios";

const player = ref(null);
const canvas = ref(null);
let mySource = ref(null);
let action = ref('');

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
    let transcript = event.results[0][0].transcript;
    output.value = transcript

    try {
      let res = await axios.post(`http://localhost:4001/api/text-to-audio-file`, {
        text: event.results[0][0].transcript
      })

      if(res.data) {
        
      }

    } catch(error) {
      console.log(error)
    }
  }
}

</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
