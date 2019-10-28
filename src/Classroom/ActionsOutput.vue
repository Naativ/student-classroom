<template>
  <div class="class-notes">
    <div>
      <h2>{{lesson.title}}</h2>
      <div
        v-for="(slide, index) in lesson.slides"
        :key="index"
        :class="{'active': isCurrentSlide(index + 1)}"
      >
        <h4 class="my-3" :ref="`actionsSlide${index + 1}`" >{{slide.title}}</h4>
        <ul>
          <li v-for="action in slide.actions" v-html="action" :key="action"></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { delay } from '@/utils/Helpers'
export default {
  name: 'ClassNotes',
  props: ['currentSlide'],
  data() {
    return {
      lesson: {
        title: 'COLORS',
        description: 'This lesson will talk about the primary colors and basic understanding of conversations. Ideally, these words will help your student practice their descriptions of different objects of varying color.',
        objective: '<div> At completion of this lesson, students will be able to: </div> <div> <ul> <li>Recognize, spell, and pronounce the color words BLUE, RED, and YELLOW</li> <li>Spell and pronounce words that are commonly associated with those colors</li><li>Use both color and associated words in complete spoken sentences</li></ul></div>',
        wordList: 'Blue, Red, Yellow, Whale, Leaf, Truck, Fish, Shoe, Bird, Bus, Hair, House, Apple, Shirt',
        slides: [
          {
            title: 'Slide 1',
            description: ['Welcome to Naativ!']
          },
          {
            title: 'Slide 2',
            description: [`Greet your student and introduce the lesson concept: Today, we are going to be
                          learning color words.`]
          },
          {
            title: 'Slide 3',
            description: ['Use TPR and repetition to teach the correct answer of the color in the pictures.', 'Focus on pronunciation or “R” and “L”'],
            actions: ['What color is it?', 'House – red', 'Shirt – blue', 'Hair - yellow']
          },
          {
            title: 'Slide 4',
            description: ['Introduce the color word “blue” by saying the word, spelling the word, sounding it phonetically, and pronouncing it again. Then, ask students to complete the same process.', 'If necessary, begin spelling out the word as well.'],
            actions: ['“Blue”', '“Bl-ue”']
          },
          {
            title: 'Slide 5',
            description: ['Use TPR and props to help teach the word “bird”'],
            actions: ['“This is a ______ (bird)”']
          },
          {
            title: 'Slide 6',
            description: ['Work through the answer to this sentence with the student.', 'Use TPR to demonstrate “yes” and “no” responses'],
            actions: ['“The bird is _____ (blue)”', '*orange', '*pink', '*blue', '*red']
          },
          {
            title: 'Slide 7',
            description: ['Use TPR to demonstrate “yes” or “no” responses until you arrive to the correct response (bird).'],
            actions: ['(Bird, Bus, Apple)', 'Circle the object that is blue']
          },
          {
            title: 'Slide 8 (Summative Assessment Activity)',
            description: ['Find the words that make the sound “BL”'],
            actions: ['“BL” (bl-uh)', 'Circle the words that sound like: BL', 'Back, blink, bring, block, blank, by, bite, black, bark, bored']
          },
          {
            title: 'Slide 9',
            description: ['Introduce the color word “red” by saying the word, spelling the word, sounding it phonetically, and pronouncing it again. Then, ask students to complete the same process.', 'If possible, begin spelling out the word as well.'],
            actions: ['“RED”', 'R-E-D']
          },
          {
            title: 'Slide 10',
            description: ['Teach the word “shoe”. Use TPR and bring a prop as well to help demonstrate the meaning of the word.'],
            actions: ['“This is a ______ (shoe)”']
          },
          {
            title: 'Slide 11',
            description: ['Find the correct answer. Use TPR to demonstrate “Yes” and “no” response to the varying answers.'],
            actions: ['“The shoe is _____ (red).”', '*Yellow', '*Red', '*Brown', '*Rust']
          },
          {
            title: 'Slide 12',
            description: ['Circle the correct answer (truck).', 'Use TPR to demonstrate “yes” and “no” responses to the other pictures.'],
            actions: ['(whale, leaf, truck)', 'Circle the object that is red']
          },
          {
            title: 'Slide 13',
            description: ['Teach the word Yellow! If time allows, spell it out with your student.', 'Bring props of other things that might be yellow.'],
            actions: ['“Yellow”', 'Y-e-l-l-o-w']
          },
          {
            title: 'Slide 14',
            description: ['Teach the word fish. Use TPR and other visual illustrations to teach demonstrate “fish”'],
            actions: ['“This is a ______ (fish)”']
          },
          {
            title: 'Slide 15',
            description: ['Use TPR to demonstrate “yes” and “no” responses to finish the answer (yellow).'],
            actions: ['“The fish is _____(yellow)”', '*yellow', '*green', '*white', '*purple']
          },
          {
            title: 'Slide 16 (Sight Word Matching Formative Assessment)',
            description: ['Draw a line!', 'Red - shoe', 'Yellow – fish', 'Blue - bird'],
            actions: ['Instruct your student to draw a line from the word to its object.', 'Show them how to do it and have they repeat your steps if they do not understand.']
          },
          {
            title: 'Slide 17 ',
            description: ['Have your student repeat after you in saying each of these sentences.', 'Have them say the correct color of their respective objects in the picture.'],
            actions: ['“What color is it?”', '“The bird is ____(blue).”', '“The shoe is ____ (red).”', '“The fish is ______(yellow).”']
          },
          {
            title: 'Slide 18 ("Show and Tell" Freeform Conversation Activity)',
            description: ['Use TPR to ask your student if they have things that are blue, red, or yellow.', 'You can also bring some things of your own to further discuss these colors.'],
            actions: ['“What is blue?”', '“What is red?”', '“What is yellow?”']
          },
          {
            title: 'Slide 19 ("Word Wall" Vocabulary Builder Conversation Activity)',
            description: ['Have the student repeat each of these words back to you.', 'If time allows, you can ask them “what is the _______?” and then have them circle the picture that represent your object.'],
            actions: ['Whale, leaf, truck, fish, shoe, bird, bus, hair, house, apple, shirt']
          },
          {
            title: 'Slide 20',
            description: ['Naativ closer slide']
          }
        ]
      }
    }
  },
  methods: {
    isCurrentSlide(slide) {
      return this.currentSlide === slide
    },
    async update() {
      await delay(200)
      if (this.currentSlide > 1) {
        this.$refs[`actionsSlide${this.currentSlide}`][0].scrollIntoView()
      }
    }
  },
  watch: {
    currentSlide(newVal, oldVal) {
      // Since we are in a loop, the ref gets added to an array... weird
      this.$refs[`actionsSlide${newVal}`][0].scrollIntoView()
    }
  }
}
</script>

<style lang="stylus" scoped>
.active {
  background-color: rgba(252, 186, 0, 0.25);
}
</style>
